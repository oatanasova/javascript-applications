window.addEventListener('load', () => {
    updateNavigation();
    showView('home');
});

const BASE_URL = 'http://localhost:3030';

const storageKey = 'fisherUser'
const main = document.querySelector('main');

const views = {
    home: document.querySelector('#home-view'),
    login: document.querySelector('#login-view'),
    register: document.querySelector('#register-view')
};

const catches = views.home.querySelector('#catches');
const addForm = views.home.querySelector('#addForm');
const loginForm = views.login.querySelector('form');
const registerForm = views.register.querySelector('form');

const fieldNames = ['angler', 'weight', 'species', 'location', 'bait', 'captureTime'];

let user = JSON.parse(sessionStorage.getItem(storageKey) || null);

document.querySelector('#views').remove();
catches.replaceChildren();

document.querySelector('nav #home').addEventListener('click', event => {
    event.preventDefault();
    showView('home');
});

document.querySelector('nav #login').addEventListener('click', event => {
    event.preventDefault();
    showView('login');
});

document.querySelector('nav #register').addEventListener('click', event => {
    event.preventDefault();
    showView('register');
});

document.querySelector('nav #logout').addEventListener('click', logOut);

loginForm.addEventListener('submit', event => authenticate(event, 'login'));
registerForm.addEventListener('submit', event => authenticate(event, 'register'));
views.home.querySelector('.load').addEventListener('click', loadCatches);
addForm.addEventListener('submit', addCatch);

function showView(name) {
    main.replaceChildren(views[name]);
    for (let link of document.querySelectorAll('nav a')) {
        link.classList.toggle('active', link.id === name);
    }
}

function updateNavigation() {
    document.querySelector('#user').style.display = user ? 'inline-block' : 'none';
    document.querySelector('#guest').style.display = user ? 'none' : 'inline-block';
    document.querySelector('.email span').textContent = user ? user.email : 'guest';
    addForm.querySelector('.add').disabled = !user;
}

async function logOut(event) {
    event.preventDefault();
    try {
        await request('/users/logout');
        sessionStorage.removeItem(storageKey);
        user = null;

        catches.replaceChildren();
        updateNavigation();
        showView('home');
    } catch (error) {
        console.error(error.message);
        showView('home')
    }
}


async function authenticate(event, action) {
    event.preventDefault();

    const form = event.currentTarget;
    const notification = form.querySelector('.notification');

    const data = new FormData(form);
    const email = data.get('email');
    const password = data.get('password');
    notification.textContent = '';

    try {
        const result = await request(`/users/${action}`, 'POST', { email, password });
        user = { _id: result._id, email: result.email, accessToken: result.accessToken };
        sessionStorage.setItem(storageKey, JSON.stringify(user));
        catches.replaceChildren();

        updateNavigation();
        showView('home');
    } catch (error) {
        notification.textContent = error.message;
    }

}

async function loadCatches() {
    try {
        const records = await request('/data/catches');
        catches.replaceChildren(...Object.values(records).map(createCatch));
    } catch (error) {
        console.error(error.message);
    }
}

function createCatch(record) {
    const container = document.createElement('div');
    container.className = 'catch';

    const isOwner = Boolean(user && user._id === record._ownerId);
    const labels = ['Angler', 'Weight', 'Species', 'Location', 'Bait', 'Capture Time'];

    fieldNames.forEach((name, index) => {
        const label = document.createElement('label');
        label.textContent = labels[index];
        const input = document.createElement('input');
        input.className = name;
        input.type = name === 'captureTime' ? 'number' : 'text';
        input.value = record[name];
        input.disabled = !isOwner;
        container.append(label, input);
    });

    const updateBtn = document.createElement('button');
    updateBtn.className = 'update';
    updateBtn.textContent = 'Update';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete';
    deleteBtn.textContent = 'Delete';
    container.append(updateBtn, deleteBtn);
    updateBtn.disabled = !isOwner;
    deleteBtn.disabled = !isOwner;

    updateBtn.dataset.id = record._id;
    deleteBtn.dataset.id = record._id;

    updateBtn.addEventListener('click', async () => {
        const data = {};

        fieldNames.forEach(name => {
            const input = container.querySelector(`.${name}`);
            data[name] = input.value;
        });

        // data.weight = Number(data.weight);
        // data.captureTime = Number(data.captureTime);

        await request(`/data/catches/${record._id}`, 'PUT', data);
    });
    deleteBtn.addEventListener('click', async () => {
        await request(`/data/catches/${record._id}`, 'DELETE');
        container.remove();
    })

    return container;
}

async function addCatch(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // data.weight = Number(data.weight);
    // data.captureTime = Number(data.captureTime);

    try {
        await request('/data/catches', 'POST', data);
        await loadCatches();
        form.reset();
    } catch (error) {
        console.error(error.message);
    }
}

async function request(path, method = 'GET', data) {
    const options = { method, headers: {} };

    if (user) {
        options.headers['X-Authorization'] = user.accessToken;
    }

    if (data !== undefined) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(data);
    }

    const response = await fetch(BASE_URL + path, options);

    if (!response.ok) {
        throw new Error('Request failed')
    }

    if (response.status !== 204) {
        return response.json();
    }
}