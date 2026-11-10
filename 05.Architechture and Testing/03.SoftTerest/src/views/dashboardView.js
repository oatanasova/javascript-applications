import { dataService } from "../api/dataService.js";
import { routing } from "../utils/routingModule.js";

const section = document.querySelector('div[data-section="dashboard"]');
const root = document.getElementById('root');

export async function showDashboardView(){
    root.replaceChildren(section);

    const ideas = await dataService.getAllIdea();

    section.innerHTML = '';
    if(ideas.length === 0){
       return section.innerHTML = '<h1>No ideas yet! Be the first one :)</h1>';
    } 

    ideas.forEach(idea => section.innerHTML += createIdea(idea));

    Array.from(section.querySelectorAll('a')).forEach(a => a.addEventListener('click', openDetails))
}

function createIdea(idea){
    return `
        <div class="card overflow-hidden current-card details" style="width: 20rem; height: 18rem;">
            <div class="card-body">
                <p class="card-text">${idea.title}</p>
            </div>
            <img class="card-image" src=${idea.img} alt="Card image cap">
            <a class="btn" data-id=${idea._id} href="/details">Details</a>
        </div>
    `
}

function openDetails(e){
    e.preventDefault();

    const id = e.target.dataset.id;

    routing.goTo('/details', id);
}