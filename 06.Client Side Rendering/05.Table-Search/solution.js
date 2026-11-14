import { html, render } from "./node_modules/lit-html/lit-html.js";

const tbody = document.querySelector('tbody');
const searchRef = document.getElementById('searchField');
document.querySelector('#searchBtn').addEventListener('click', onClick);

loadData();

const personTemplate = (person) => html`
  <tr>
    <td>${person.firstName} ${person.lastName}</td>
    <td>${person.email}</td>
    <td>${person.course}</td>
  </tr>
`;

function onClick(e) {
  e.preventDefault();

  const rows = Array.from(tbody.querySelectorAll('tr'));
  const search = searchRef.value.trim().toLowerCase();

  rows.forEach((row) => row.classList.remove('select'));

  if (!search) {
    searchRef.value = '';
    return;
  }

  rows
    .filter((row) => row.textContent.toLowerCase().includes(search))
    .forEach((row) => row.classList.add('select'));

  searchRef.value = '';
}

async function loadData() {
  const response = await fetch('http://localhost:3030/jsonstore/advanced/table');
  const data = Object.values(await response.json());
  const students = data.map(personTemplate);

  render(students, tbody);
}