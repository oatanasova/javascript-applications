import { dataService } from "../api/dataService.js";
import { routing } from "../utils/routingModule.js";
import { userUtils } from "../utils/userUtils.js";


const section = document.querySelector('div[data-section="details"]');
const root = document.getElementById('root');

export async function showDetailsView(params){
    const id = params[0];
    const idea = await dataService.getIdeaById(id);
    root.replaceChildren(section);

    showIdea(idea);
}

function showIdea(idea) {
    section.innerHTML= `
        <img class="det-img" src=${idea.img} />
        <div class="desc">
            <h2 class="display-5">${idea.title}</h2>
            <p class="infoType">Description:</p>
            <p class="idea-description">${idea.description}</p>
        </div>
        <div class="text-center">
            ${userUtils.hasOwner(idea._ownerId) 
                ? `<a class="btn detb" data-id= ${idea._id} href="">Delete</a>` 
                : ""
            }
        </div>
    `

    section.querySelector('a')?.addEventListener('click', onDelete);
}

async function onDelete(e){
    e.preventDefault();
    const id = e.target.dataset.id;
    await dataService.deleteIdea(id);
    routing.goTo('/dashboard')
}