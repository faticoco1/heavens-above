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

    // Mock HTTP request function
    const mockedRequest = jest.fn();

    // Override request module with mocked function
    jest.mock('request', () => jest.fn().mockImplementation(mockedRequest));

    // Call the getTable function
    getTable(config);

    // Expect the mocked request function to have been called
    expect(mockedRequest).toHaveBeenCalled();
  });
});
