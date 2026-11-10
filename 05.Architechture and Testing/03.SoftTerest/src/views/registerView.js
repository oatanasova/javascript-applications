import { routing, updateNav } from "../utils/routingModule.js";
import { userService } from "../api/userService.js"

const section = document.querySelector('div[data-section="register"]');
const root = document.getElementById('root');

export function showRegisterView() {
    root.replaceChildren(section);
    section.querySelector('a').addEventListener('click', onNavigate);

    section.querySelector('form').addEventListener('submit', onSubmit);
}

function onNavigate(e){
    e.preventDefault();
    routing.goTo('/login')
}

async function onSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);

    const { email, password, repeatPassword } = Object.fromEntries(formData);

    if (email.length < 3 || password.length < 3 || password !== repeatPassword) {
        return alert("error");
    }
    e.target.reset();
    await userService.register({ email, password });
    updateNav();
    routing.goTo('/');
}