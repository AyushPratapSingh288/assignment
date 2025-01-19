module.exports = {
    // The root directory for Jest to look for tests
    roots: ['<rootDir>/test'],
  
    // Specify test files to match
    testMatch: ['**/*.test.js'],
  
    // Ignore node_modules directory
    testPathIgnorePatterns: ['/node_modules/'],
  
    // Automatically clear mock calls and instances before every test
    clearMocks: true,
  
    // Set the test environment (e.g., 'node' or 'jsdom')
    testEnvironment: 'node',
  };
  