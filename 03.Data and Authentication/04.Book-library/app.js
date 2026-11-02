const BASE_URL = ' http://localhost:3030/jsonstore/collections/books';
const output = document.querySelector('tbody')
document.querySelector('#loadBooks').addEventListener('click', onLoad);

const formLabel = document.querySelector('form h3');
const titleRef = document.querySelector('form [name="title"]');
const authorRef = document.querySelector('form [name="author"]');
let currentBookId = null;

const form = document.querySelector('form');
form.addEventListener('click', onSubmit);


async function onLoad() {
    output.replaceChildren();
    try {
        const data = await getFetch(BASE_URL);

        Object.entries(data).forEach(([id, book]) => {
            const tr = document.createElement('tr');
            tr.dataset.id = id;
            const title = document.createElement('td');
            title.textContent = book.title;
            const author = document.createElement('td');
            author.textContent = book.author;

            const actions = document.createElement('td');
            const editBtn = document.createElement('button');
            const deleteBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            deleteBtn.textContent = 'Delete';

            editBtn.addEventListener('click', onEdit);
            deleteBtn.addEventListener('click', onDelete);

            actions.appendChild(editBtn);
            actions.appendChild(deleteBtn);
            tr.appendChild(title);
            tr.appendChild(author);
            tr.appendChild(actions);
            output.appendChild(tr);
        });
    } catch (error) {
        console.error(error.message);
    }
}

function onEdit(event) {
    const editBtn = event.target;
    const row = editBtn.closest('tr');

    const title = row.children[0].textContent;
    const author = row.children[1].textContent;
    currentBookId = row.dataset.id

    formLabel.textContent = 'Edit FORM';
    titleRef.value = title;
    authorRef.value = author;
    document.querySelector('form button').textContent = 'Save';

}

async function onDelete(event) {
    const deleteBtn = event.target;
    const row = deleteBtn.closest('tr');
    currentBookId = row.dataset.id
    const data = await getFetch(BASE_URL + `/${currentBookId}`, {
        method: 'DELETE'
    });
    currentBookId = null;
    await onLoad();
}

async function onSubmit(event) {
    event.preventDefault();
    if (!titleRef.value || !authorRef.value) return;

    if (currentBookId) {
        await getFetch(BASE_URL + `/${currentBookId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: titleRef.value,
                author: authorRef.value
            })
        });
    } else {
        await getFetch(BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: titleRef.value,
                author: authorRef.value
            })
        });
    }
    formLabel.textContent = 'FORM';
    document.querySelector('form button').textContent = 'Submit';

    titleRef.value = '';
    authorRef.value = '';
    currentBookId = null;
    await onLoad();
}

async function getFetch(url, params) {
    const response = await fetch(url, params);
    if (!response.ok) {
        throw new Error('Something went wrong');
    }

    if (response.status !== 204) {
        return response.json();
    }
}