import { dataService } from "../api/dataService.js";
import { routing } from "../utils/routingModule.js";


const section = document.querySelector('div[data-section="create"]');
const root = document.getElementById('root');

export function showCreateView() {
    root.replaceChildren(section);

    section.querySelector('form').addEventListener('submit', onSubmit);
}

async function onSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    const { title, description, imageURL } = Object.fromEntries(formData);

    if (title.length < 6 || description.length < 10 | imageURL.length < 5){
        return alert('error')
    }

    await dataService.createIdea({title, description, img: imageURL});
    routing.goTo('/dashboard')
}