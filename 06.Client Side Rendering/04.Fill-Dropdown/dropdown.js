import { html, render } from "./node_modules/lit-html/lit-html.js";

const selector = document.getElementById('menu');
const form = document.querySelector('form');
// const itemText = document.getElementById('itemText');
form.addEventListener('submit', onAdd);

const template = (item) => html`<option value=${item._id}>${item.text}</option>`;
// const template = (items) => 
//     items.map((item) => html`<option value=${item._id}>${item.text}</option>`);

loadData();

function onAdd(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const item = formData.get('item')?.trim();

    if (!item) {
        return;
    }

    addItem(item);
    form.reset();
}

async function loadData() {
    const response = await fetch('http://localhost:3030/jsonstore/advanced/dropdown');
    const data = await response.json();
    const items = Object.values(data);

    // render(template(items), selector);
    render(items.map(template), selector);
}

async function addItem(text) {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
    };

    await fetch('http://localhost:3030/jsonstore/advanced/dropdown', options);
    // render(template(data), selector);
    await loadData();
}


// const response = await fetch('http://localhost:3030/jsonstore/advanced/dropdown');
// const data = Object.values(await response.json());

// render(template(data), root);

// async function addItem(e) {
//   e.preventDefault();
//   await fetch('http://localhost:3030/jsonstore/advanced/dropdown', {
//     method: 'post',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ text: itemText.value }),
//   });
//   const fetchData = await fetch('http://localhost:3030/jsonstore/advanced/dropdown');
//   const data = Object.values(await fetchData.json());

//   form.reset();
//   render(optionTemplate(data), root);
// }