const { test, expect } = require("@playwright/test");

const apiURL = 'http://localhost:3030/jsonstore/messenger';
const headers = { 'Access-Control-Allow-Origin': '*' };
const messages = {
  '1001': { author: 'Paul', content: "Hello losers" },
  '1002': { author: 'Max', content: "Wazaaap" },
}

test.beforeEach(async ({ page }) => {
  await page.route('http://localhost:3030/**', (route) => route.abort());
})

test('Refresh load and displays all messages', async ({ page }) => {
  await page.route(apiURL, (route) => route.fulfill({ json: messages, headers }));
  await page.goto('http://127.0.0.1:5500/05.Architechture%20and%20Testing/01.Messenger/');

  await page.click('#refresh');

  await expect(page.locator('#messages')).toHaveValue('Paul: Hello losers\nMax: Wazaaap')
})

test('Send makes a post request with author and content', async ({ page }) => {
  const message = { author: 'Sara', content: 'you are all idiots' };

  await page.route(apiURL, (route) => route.fulfill({ json: message, headers }));
  await page.goto('http://127.0.0.1:5500/05.Architechture%20and%20Testing/01.Messenger/');

  await page.fill('[name="author"]', message.author);
  await page.fill('[name="content"]', message.content);

  const requestPromise = page.waitForRequest(apiURL);
  await page.click('#submit');
  const request = await requestPromise;

  expect(request.method()).toBe('POST');
  expect(request.headers()['content-type']).toBe('application/json');
  expect(request.postDataJSON()).toEqual(message);
})