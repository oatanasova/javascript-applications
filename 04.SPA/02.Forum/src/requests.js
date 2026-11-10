
const BASE_URL = 'http://localhost:3030/jsonstore/collections/myboard'

export async function requestor(url, method = 'GET', data) {
    const options = { method, headers: {} };

    if (data !== undefined) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(data);
    }

    const response = await fetch(BASE_URL + url, options);

    if (!response.ok) throw new Error('Request failed');

    if (response.status === 204) return;

    return response.json();
}
