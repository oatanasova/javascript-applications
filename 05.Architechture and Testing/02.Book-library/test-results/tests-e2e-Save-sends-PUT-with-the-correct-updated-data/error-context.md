# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\e2e.test.js >> Save sends PUT with the correct updated data
- Location: tests\e2e.test.js:73:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('#loadBook')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - button "LOAD ALL BOOKS" [ref=e2]
  - table [ref=e3]:
    - rowgroup [ref=e4]:
      - row [ref=e5]:
        - columnheader "Title" [ref=e6]
        - columnheader "Author" [ref=e7]
        - columnheader "Action" [ref=e8]
    - rowgroup [ref=e9]:
      - row [ref=e10]:
        - cell "Harry Poter" [ref=e11]
        - cell "J. K. Rowling" [ref=e12]
        - cell [ref=e13]:
          - button "Edit" [ref=e14]
          - button "Delete" [ref=e15]
      - row [ref=e16]:
        - cell "Game of Thrones" [ref=e17]
        - cell "George R. R. Martin" [ref=e18]
        - cell [ref=e19]:
          - button "Edit" [ref=e20]
          - button "Delete" [ref=e21]
  - generic [ref=e22]:
    - heading "FORM" [level=3] [ref=e23]
    - generic [ref=e24]: TITLE
    - textbox "Title..." [ref=e25]
    - generic [ref=e26]: AUTHOR
    - textbox "Author..." [ref=e27]
    - button "Submit" [ref=e28]
```

# Test source

```ts
  1   | const { test, expect } = require('@playwright/test');
  2   | 
  3   | const apiURL = 'http://localhost:3030/jsonstore/collections/books';
  4   | const headers = { 'Access-Control-Allow-Origin': '*' };
  5   | const books = {
  6   |     '1001': { title: 'The Hobbit', author: 'Tolkien' },
  7   |     '1002': { title: 'Dune', author: 'Frank' }
  8   | }
  9   | test.beforeEach(async ({ page }) => {
  10  |     await page.route('http://localhost:3030/**', (route) => route.abort());
  11  | 
  12  |     await page.route(apiURL, (route) => route.request().method() === 'GET' ?
  13  |         route.fulfill({ json: books, headers }) : route.abort());
  14  | 
  15  |     await page.goto('http://127.0.0.1:5500/05.Architechture%20and%20Testing/02.Book-library/');
  16  | })
  17  | 
  18  | test('Load every book title and author', async ({ page }) => {
  19  |     await page.click('#loadBooks');
  20  | 
  21  |     await expect(page.locator('tbody tr')).toHaveCount(2);
  22  |     await expect(page.locator('tbody tr:nth-child(1)')).toHaveText(['The Hobbit', 'Dune']);
  23  |     await expect(page.locator('tbody tr:nth-child(1)')).toHaveText(['Tolkien', 'Frank']);
  24  | })
  25  | 
  26  | test('Submit rejectsed an emprty title or author', async ({ page }) => {
  27  |     let alerts = 0;
  28  |     let sendPost = false;
  29  | 
  30  |     page.on('dialog', (dialog) => {
  31  |         alerts++;
  32  |         dialog.accept();
  33  |     });
  34  |     page.on('request', (request) => {
  35  |         if (request.url() === apiURL && request.method() === 'POST') sendPost = true;
  36  |     })
  37  | 
  38  |     await page.fill('form [name="title"]', '');
  39  |     await page.fill('form [name="author"]', 'someone');
  40  |     await page.click('form button');
  41  | 
  42  |     expect(alerts).toBe(1);
  43  |     expect(sendPost).toBe(false);
  44  | 
  45  | 
  46  |     await page.fill('form [name="title"]', 'something');
  47  |     await page.fill('form [name="author"]', '');
  48  |     await page.click('form button');
  49  | 
  50  |     expect(alerts).toBe(2);
  51  |     expect(sendPost).toBe(false);
  52  | })
  53  | 
  54  | test('submit send the correct POST request', async ({ page }) => {
  55  |     let book = { title: 'JS basics', author: 'someone' }
  56  | 
  57  |     await page.route(apiURL, (route) => {
  58  |         if (route.request().method() === 'POST') return route.fulfill({ json: books, headers });
  59  |         return route.fulfill({ json: book, headers });
  60  |     })
  61  |     await page.fill('form [name="title"]', book.title);
  62  |     await page.fill('form [name="author"]', book.author);
  63  | 
  64  |     const requestPromise = page.waitForRequest(apiURL);
  65  |     await page.click('form button');
  66  |     const request = await requestPromise;
  67  | 
  68  |     expect(request.method()).toBe('POST');
  69  |     expect(request.headers()['content-type']).toBe('application/json');
  70  |     expect(request.postDataJSON()).toEqual(book);
  71  | })
  72  | 
  73  | test('Save sends PUT with the correct updated data', async ({ page }) => {
  74  |     let book = { title: 'Dune 3', author: 'Frank' }
  75  |     let bookURL = apiURL + '/1002';
  76  | 
  77  |     await page.route(apiURL, (route) => route.fulfill({ json: books, headers }));
> 78  |     await page.click('#loadBook');
      |                ^ Error: page.click: Test timeout of 30000ms exceeded.
  79  | 
  80  |     await expect(page.locator('tbody tr')).toHaveCount(2);
  81  |     await page.click('tbody tr:nth-child(2) button:nth-child(1)');
  82  |     await page.fill('form [name="title"]', book.title);
  83  |     await page.fill('form [name="author"]', book.author);
  84  | 
  85  |     const requestPromise = page.waitForRequest(bookURL);
  86  |     await page.click('form button');
  87  |     const request = await requestPromise;
  88  | 
  89  |     expect(request.method()).toBe('PUT');
  90  |     expect(request.headers()['content-type']).toBe('application/json');
  91  |     expect(request.postDataJSON()).toEqual(book);
  92  | })
  93  | 
  94  | 
  95  | test('Confirm Delete sends for the selected data', async ({ page }) => {
  96  |     let bookURL = apiURL + '/1002';
  97  | 
  98  |     await page.route(apiURL, (route) => route.fulfill({ status: 204}));
  99  | 
  100 |     await page.click('#loadBook');
  101 |     await expect(page.locator('tbody tr')).toHaveCount(2);
  102 | 
  103 |     let dialogType;
  104 |     page.once('dialog', (dialog) => {
  105 |         dialogType = dialog.type();
  106 |         dialog.select();
  107 |     });
  108 |     
  109 |     const requestPromise = page.waitForRequest(bookURL);
  110 |     await page.click('tbody tr:nth-child(2) button:nth-child(2)');
  111 |     const request = await requestPromise;
  112 | 
  113 |     expect(dialogType).toBe('confirm');
  114 |     expect(request.method()).toBe('DELETE');
  115 | })
```