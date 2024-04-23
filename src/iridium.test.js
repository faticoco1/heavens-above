const { getTable } = require('./iridium');

// Mock the 'request' module completely
jest.mock('request', () => jest.fn());

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

    // Call the getTable function
    getTable(config);

    // Expect the mocked request function to have been called
    expect(require('request')).toHaveBeenCalled();
  });
});
