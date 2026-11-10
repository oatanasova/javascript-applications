import { detailsPage } from "./details.js";
import { showView } from "./utils.js";

const section = document.getElementById('home-page');
const catalog = section.querySelector('#movie .card-deck.d-flex.justify-content-center');

catalog.addEventListener('click', (event) =>{
    if(event.target.tagName === "BUTTON"){
        event.preventDefault();

        const { id } = event.target.dataset;
        detailsPage(id);
    }
});

export function homePage() {
    showView(section);
    displayMovies();
}

async function displayMovies() {
    const movies = await getMovies();

    catalog.replaceChildren(...movies.map(movieCard));
}

function movieCard(movie) {
    const liEl = document.createElement('li');
    liEl.className = 'card mt-4';
    liEl.innerHTML = `
        <img class="card-img-top" src="${movie.img}" alt="Card image cap" width="400" />
        <div class="card-body">
            <h4 class="card-title">${movie.title}</h4>
            </a>
            </div>
        <div class="card-footer">
            <a href="/details/${movie._id}">
            <button data-id="${movie._id}" type="button" class="btn btn-info">Details</button>
        </div>
    `;

    return liEl;
}

async function getMovies() {
    try {
        const url = "http://localhost:3030/data/movies"
        const repsonse = await fetch(url);
        const movies = await repsonse.json();
        return movies;
    } catch (error) {
        alert(error.message);
    }
}