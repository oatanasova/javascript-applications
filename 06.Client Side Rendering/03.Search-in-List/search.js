import { html, render, nothing } from "./node_modules/lit-html/lit-html.js";
import { towns } from "./towns.js";

document.querySelector('button').addEventListener('click', search);

const inputRef = document.getElementById('searchText');
const townsRoot = document.getElementById('towns');
const resultRef = document.getElementById('result');

const template = (matches) => html`
   <ul>
      ${towns.map((town) => html`
      <li class=${matches.includes(town) ? 'active' : nothing}>${town}</li>`
)}
   </ul>
`;

// const resultTemp = (matchesCount) => html`
//  <p>${matchesCount} match${matchesCount > 1 ? "es" : nothing} found</p>
// `

search();

function search(e) {
   let searchText = null;
   if (e) {
      searchText = inputRef.value;
      if (!searchText) {
         resultRef.textContent = ''
         return;
      }
   }

   const matches = towns.filter(x => x.includes(searchText));
   render(template(matches), townsRoot);
   resultRef.textContent = `${matches.length} matches found`;
}
