import { html, render } from './node_modules/lit-html/lit-html.js';

const root = document.getElementById('root');
const townsRef = document.getElementById('towns');

document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();

    const towns = townsRef.value.split(',').map((town) => town.trim());
    render(townTemplate(towns), root);
    e.target.reset();
});

const townTemplate = (data) => html`
    <ul>
    ${data.map((el) => html`<li>${el}</li>`)}
    </ul>
`;


// document.querySelector("form").addEventListener("submit", onSubmit);

// function onSubmit(e) {
//     e.preventDefault();
//     const towns = townsRef.value.split(", ");

//     const temp = createTemp(towns);

//     render(temp, root);
//     e.target.reset();

// }

// const townTemplate = (data) => html`
//     <ul>
//     ${data.map((el) => html`<li>${el}</li>`)}
//     </ul>
// `;