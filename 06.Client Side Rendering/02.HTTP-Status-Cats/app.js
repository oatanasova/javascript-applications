import { html, render } from './node_modules/lit-html/lit-html.js';
import { cats } from './catSeeder.js';

const root = document.getElementById('allCats');

render(createTemplate(cats), root);

function createTemplate(cats) {
    const temp = cats.map(cat => html`<li> ${createCatCard(cat)}</li>`)

    return html`
    <ul>
        ${temp}
    </ul>
    `
}

function createCatCard(cat) {
    return html`
    <img src="./images/${cat.imageLocation}.jpg" width="250" height="250" alt="Card image cap">
    <div class="info">
        <button class="showBtn" @click = ${toggleBtn}>Show status code</button>
        <div class="status" style="display: none" id="${cat.id}">
            <h4>Status Code: ${cat.statusCode}</h4>
            <p>${cat.statusMessage}</p>
        </div>
    </div>
    `
}

function toggleBtn(e) {
    e.preventDefault();
    const selected = e.target;
    const parent = selected.parentElement;
    const infoDiv = parent.querySelector('div');
    const currentState = infoDiv.style.display;

    selected.textContent = currentState === 'none' ? 'Hide status code' : 'Show status code'
    infoDiv.style.display = currentState === 'block' ? 'none' : 'block'
}