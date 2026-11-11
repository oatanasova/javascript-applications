import { html, render, nothing } from "./node_modules/lit-html/lit-html.js";


const tableRoot = document.getElementById('tableRoot');
const formRoot = document.getElementById('formRoot');

const tableTemp = (books) => html`
<button id="loadBooks" @click=${onLoadBooks}>LOAD ALL BOOKS</button>
    <table>
        <thead>
            <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            ${books?.map(([id, book]) => createBookTemp(id, book))}
        </tbody>
    </table>
`

const createFormTemp = () => html`
<form id="add-form" @submit=${onCreate}>
        <h3>Add book</h3>
        <label>TITLE</label>
        <input type="text" name="title" placeholder="Title...">
        <label>AUTHOR</label>
        <input type="text" name="author" placeholder="Author...">
        <input type="submit" value="Submit">
    </form>
`

const createBookTemp = (id, book) => html`
    <tr>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>
            <button data-id=${id} @click=${onEdit}>Edit</button>
            <button data-id=${id} @click=${onDelete}>Delete</button>
        </td>
    </tr>
`

const editTemp = (id, book) => html`
    <form id="edit-form" @submit=${onSaveEdit}>
        <input type="hidden" .value=${id} name="id">
        <h3>Edit book</h3>
        <label>TITLE</label>
        <input type="text" .value=${book.title} name="title" placeholder="Title...">
        <label>AUTHOR</label>
        <input type="text" .value=${book.author} name="author" placeholder="Author...">
        <input type="submit" value="Save">
    </form>
`

render(tableTemp(), tableRoot);
render(createFormTemp(), formRoot);

async function onLoadBooks(e) {
    const response = await fetch('http://localhost:3030/jsonstore/collections/books');
    const data = await response.json();
    const books = Object.entries(data);
    render(tableTemp(books), tableRoot);
}

async function onCreate(e) {
    e.preventDefault();

    const formData = new FormData(e.target)
    const { title, author } = Object.fromEntries(formData);

    if (!title || !author) {
        return;
    }

    storeBook({ title, author });
    e.target.reset();
}

async function storeBook(data) {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    await fetch('http://localhost:3030/jsonstore/collections/books', options);
    onLoadBooks();
}

async function onEdit(e) {
    const id = e.target.dataset.id
    const response = await fetch(`http://localhost:3030/jsonstore/collections/books/${id}`);
    const data = await response.json();
    const books = Object.values(data);

    render(editTemp(id, data), formRoot);
}

async function onSaveEdit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const { id, title, author } = Object.fromEntries(formData);

    if (!title || !author) {
        return;
    }

    saveBook({title, author, _id: id}, id);
    e.target.reset();
    render(createFormTemp(),formRoot);
}

async function saveBook(data, id) {
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }

    await fetch(`http://localhost:3030/jsonstore/collections/books/${id}`, options);
    onLoadBooks();
}

async function onDelete(e) {
    const id = e.target.dataset.id;
    await fetch(`http://localhost:3030/jsonstore/collections/books/${id}`, {
        method: "DELETE"
    });
    onLoadBooks();
}

