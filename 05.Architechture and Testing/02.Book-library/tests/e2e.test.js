const { test, expect } = require('@playwright/test');

const apiURL = 'http://localhost:3030/jsonstore/collections/books';
const headers = { 'Access-Control-Allow-Origin': '*' };
const books = {
    '1001': { title: 'The Hobbit', author: 'Tolkien' },
    '1002': { title: 'Dune', author: 'Frank' }
}
test.beforeEach(async ({ page }) => {
    await page.route('http://localhost:3030/**', (route) => route.abort());

    await page.route(apiURL, (route) => route.request().method() === 'GET' ?
        route.fulfill({ json: books, headers }) : route.abort());

    await page.goto('http://127.0.0.1:5500/05.Architechture%20and%20Testing/02.Book-library/');
})

test('Load every book title and author', async ({ page }) => {
    await page.click('#loadBooks');

    await expect(page.locator('tbody tr')).toHaveCount(2);
    await expect(page.locator('tbody tr:nth-child(1)')).toHaveText(['The Hobbit', 'Dune']);
    await expect(page.locator('tbody tr:nth-child(1)')).toHaveText(['Tolkien', 'Frank']);
})

test('Submit rejectsed an emprty title or author', async ({ page }) => {
    let alerts = 0;
    let sendPost = false;

    page.on('dialog', (dialog) => {
        alerts++;
        dialog.accept();
    });
    page.on('request', (request) => {
        if (request.url() === apiURL && request.method() === 'POST') sendPost = true;
    })

    await page.fill('form [name="title"]', '');
    await page.fill('form [name="author"]', 'someone');
    await page.click('form button');

    expect(alerts).toBe(1);
    expect(sendPost).toBe(false);


    await page.fill('form [name="title"]', 'something');
    await page.fill('form [name="author"]', '');
    await page.click('form button');

    expect(alerts).toBe(2);
    expect(sendPost).toBe(false);
})

test('submit send the correct POST request', async ({ page }) => {
    let book = { title: 'JS basics', author: 'someone' }

    await page.route(apiURL, (route) => {
        if (route.request().method() === 'POST') return route.fulfill({ json: books, headers });
        return route.fulfill({ json: book, headers });
    })
    await page.fill('form [name="title"]', book.title);
    await page.fill('form [name="author"]', book.author);

    const requestPromise = page.waitForRequest(apiURL);
    await page.click('form button');
    const request = await requestPromise;

    expect(request.method()).toBe('POST');
    expect(request.headers()['content-type']).toBe('application/json');
    expect(request.postDataJSON()).toEqual(book);
})

test('Save sends PUT with the correct updated data', async ({ page }) => {
    let book = { title: 'Dune 3', author: 'Frank' }
    let bookURL = apiURL + '/1002';

    await page.route(apiURL, (route) => route.fulfill({ json: books, headers }));
    await page.click('#loadBook');

    await expect(page.locator('tbody tr')).toHaveCount(2);
    await page.click('tbody tr:nth-child(2) button:nth-child(1)');
    await page.fill('form [name="title"]', book.title);
    await page.fill('form [name="author"]', book.author);

    const requestPromise = page.waitForRequest(bookURL);
    await page.click('form button');
    const request = await requestPromise;

    expect(request.method()).toBe('PUT');
    expect(request.headers()['content-type']).toBe('application/json');
    expect(request.postDataJSON()).toEqual(book);
})


test('Confirm Delete sends for the selected data', async ({ page }) => {
    let bookURL = apiURL + '/1002';

    await page.route(apiURL, (route) => route.fulfill({ status: 204}));

    await page.click('#loadBook');
    await expect(page.locator('tbody tr')).toHaveCount(2);

    let dialogType;
    page.once('dialog', (dialog) => {
        dialogType = dialog.type();
        dialog.select();
    });
    
    const requestPromise = page.waitForRequest(bookURL);
    await page.click('tbody tr:nth-child(2) button:nth-child(2)');
    const request = await requestPromise;

    expect(dialogType).toBe('confirm');
    expect(request.method()).toBe('DELETE');
})