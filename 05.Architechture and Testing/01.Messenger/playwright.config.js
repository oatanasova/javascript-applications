// const { defineConfig} = require('@playwright/test');

// module.exports = defineConfig({
//     testDir: '.',
//     testMatch: "**/e2e.test.js",
//     workers: 1,
//     reporter: 'list',
//     use: { baseURL: 'http://127.0.0.1:5500',
//       //  browserName: 'chromium'
//       }, //firefox
//     webserver: {
//         command: 'node node_modules/http-server/bin/http-server -a localhost -a 127.0.0.1 -p 3000 -c-1',
//         url: 'http://127.0.0.1:3001',
//         reuseExistingServer: false,
//     },
// });


const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: '.',
  testMatch: '**/e2e.test.js',
  use: {
    baseURL: 'http://127.0.0.1:5500/05.Architechture%20and%20Testing/01.Messenger/'
  }
});