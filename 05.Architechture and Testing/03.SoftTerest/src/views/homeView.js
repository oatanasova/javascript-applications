import { routing } from "../utils/routingModule.js";

const section = document.querySelector('div[data-section="home"]');
const root = document.getElementById('root');

export function showHomeView(){
    section.querySelector('a').addEventListener('click', onNavigate)
    root.replaceChildren(section);
}

function onNavigate(e){
    e.preventDefault();
    routing.goTo('/dashboard')
}