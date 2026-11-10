import { userService } from "../api/userService.js";
import { routing, updateNav } from "../utils/routingModule.js";

const section = document.querySelector('div[data-section="login"]');
const root = document.getElementById('root');

export function showLoginView() {
    root.replaceChildren(section);
    section.querySelector('a').addEventListener('click', onNavigate);

    section.querySelector('form').addEventListener('submit', onSubmit);
}

function onNavigate(e){
    e.preventDefault();
    routing.goTo('/register')
}

async function onSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);

    const { email, password } = Object.fromEntries(formData);

    if (!email || !password) {
        return alert('error');
    }
    e.target.reset();
    await userService.login({ email, password });
    updateNav();
    routing.goTo('/');

}