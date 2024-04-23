const { getTable } = require('./iridium');

describe('Iridium Module', () => {
  test('getTable function retrieves table data from URL', () => {
    // Mock configuration object for getTable function
    const config = {
      database: [],
      counter: 0,
      opt: 'your-url-query-parameters',
      root: '/path/to/your/root/directory/',
      pages: 1 // Number of pages to fetch
    };

    // Mock HTTP response
    const mockedResponse = {
      statusCode: 200,
      body: 'HTML content of the table',
    };

    // Mock HTTP request function
    const mockedRequest = jest.fn((options, callback) => {
      callback(null, mockedResponse, mockedResponse.body);
    });

    // Override request module with mocked function
    jest.mock('request', () => jest.fn().mockImplementation(mockedRequest));

    // Call the getTable function
    getTable(config);

    // Assertions
    expect(mockedRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.any(String), // Ensure any string URL is expected
        method: 'GET', // Ensure the expected HTTP method is GET
        // Add other expected request options here
      }),
      expect.any(Function)
    );

    // You can add more assertions based on the expected behavior of getTable function
  });
});
