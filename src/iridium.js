/**
 * Module dependencies.
 */
const request = require("request"); // HTTP client library
const cheerio = require("cheerio"); // HTML parsing library
const fs = require("fs"); // File system module
const utils = require("./utils"); // Utility functions

/**
 * List of event types for Iridium flares.
 * @constant
 * @type {string[]}
 */
const eventsIridium = [
  "brightness",
  "altitude",
  "azimuth",
  "satellite",
  "distanceToFlareCentre",
  "brightnessAtFlareCentre",
  "date",
  "time",
  "distanceToSatellite",
  "AngleOffFlareCentre-line",
  "flareProducingAntenna",
  "sunAltitude",
  "angularSeparationFromSun",
  "image",
  "id",
];

/**
 * Retrieves table data from the specified URL and saves it to the file system.
 * @param {Object} config - Configuration object.
 * @param {Array<Object>} config.database - Array to store table data.
 * @param {number} config.counter - Counter for pagination.
 * @param {string} config.opt - URL query parameters.
 * @param {string} config.root - Root directory path.
 */
function getTable(config) {
  let database = config.database || [];
  let counter = config.counter || 0;
  const opt = config.opt || 0;
  const basedir = config.root + "IridiumFlares/";

  // Configure options based on the counter
  let options;
  if (counter === 0) {
    options = utils.get_options("IridiumFlares.aspx?");
    if (!fs.existsSync(basedir)) {
      fs.mkdir(basedir, (err) => {
        if (err) console.log(err);
      });
    }
  } else {
    options = utils.post_options("IridiumFlares.aspx?", opt);
  }

  // Make HTTP request to get table data
  request(options, (error, response, body) => {
    if (error || response.statusCode !== 200) return;
    const $ = cheerio.load(body, {
      decodeEntities: false,
    });
    let next = "__EVENTTARGET=&__EVENTARGUMENT=&__LASTFOCUS=";
    const tbody = $("form").find("table.standardTable tbody");
    const queue = [];

    // Extract table data
    tbody.find("tr").each((i, o) => {
      const temp = {};
      for (let i = 0; i < 6; i++) {
        temp[eventsIridium[i]] = $(o)
          .find("td")
          .eq(i + 1)
          .text();
      }
      temp["url"] =
        "https://www.heavens-above.com/" +
        $(o)
          .find("td")
          .eq(0)
          .find("a")
          .attr("href")
          .replace("type=V", "type=A");
      queue.push(temp);
    });

    // Function to fetch detailed data for each item in the queue
    function factory(temp) {
      return new Promise((resolve, reject) => {
        request(utils.iridium_options(temp["url"]), (error, response, body) => {
          if (error || response.statusCode !== 200) {
            reject(error);
            return;
          }
          console.log("Success", temp);
          const $ = cheerio.load(body, {
            decodeEntities: false,
          });
          const table = $("form").find("table.standardTable"),
            tr = table.find("tbody tr");
          [
            [6, 0],
            [7, 1],
            [8, 6],
            [9, 7],
            [10, 9],
            [11, 10],
            [12, 11],
          ].forEach((ele) => {
            temp[eventsIridium[ele[0]]] = tr.eq(ele[1]).find("td").eq(1).text();
          });
          temp[eventsIridium[13]] =
            "https://www.heavens-above.com/" +
            $("#ctl00_cph1_imgSkyChart").attr("src");
          const id = utils.md5(Math.random().toString());
          temp[eventsIridium[14]] = id;
          fs.appendFile(basedir + id + ".html", table.html(), (err) => {
            if (err) console.log(err);
          });
          request
            .get(utils.image_options(temp[eventsIridium[13]]))
            .pipe(
              fs.createWriteStream(basedir + id + ".png", {
                flags: "a",
              })
            )
            .on("error", (err) => {
              console.error(err);
            });
          resolve(temp);
        });
      });
    }

    // Fetch detailed data for each item in the queue
    Promise.allSettled(queue.map((temp) => factory(temp))).then((results) => {
      results = results
        .filter((p) => p.status === "fulfilled")
        .map((p) => p.value);
      database = database.concat(results);
      $("form")
        .find("input")
        .each((i, o) => {
          if (
            $(o).attr("name") === "ctl00$cph1$btnPrev" ||
            $(o).attr("name") === "ctl00$cph1$visible"
          )
            return;
          else next += `&${$(o).attr("name")}=${$(o).attr("value")}`;
        });
      next += "&ctl00$cph1$visible=radioVisible";
      next = next.replace(/\+/g, "%2B").replace(/\//g, "%2F");
      if (counter++ < config.pages) {
        getTable({
          count: config.count,
          pages: config.pages,
          root: config.root,
          counter,
          opt: next,
          database,
        });
      } else {
        fs.appendFile(
          basedir + "index.json",
          JSON.stringify(database),
          (err) => {
            if (err) console.log(err);
          }
        );
      }
    });
  });
}

// Export the function for use in other modules
exports.getTable = getTable;
