async function attachEvents() {
    const BASE_URL = 'http://localhost:3030/jsonstore/blog/';
    const loadBtn = document.getElementById('btnLoadPosts');

    const response = await fetch(BASE_URL + 'posts');
    const data = await reposnce.json();

}

attachEvents();