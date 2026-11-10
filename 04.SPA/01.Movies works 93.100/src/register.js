import { homePage } from "./home.js";
import { showView, updateNav } from "./utils.js";

const section = document.getElementById('form-sign-up');
const form = section.querySelector('form');

form.addEventListener('submit', onSubmit)

export function registerPage() {
    showView(section);
}

async function onSubmit(event) {
    event.preventDefault();
    const formData = new FormData(form);
    const email = formData.get('email');
    const password = formData.get('password');
    const rePass = formData.get('repeatPassword');

    if (!email || !password || password.length < 6 || !rePass) {
        alert("All field are required");
        return;
    }

    if (password !== rePass) {
        alert('Passwords mush match');
        return;
    }
    await register(email, password);
    form.reset();
    updateNav();
    homePage();
}

async function register(email, password) {
    try {
        const url = "http://localhost:3030/users/register";
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if(response.status !== 200 || !response.ok){
            throw new Error("Failed to register");
        }
        const userData = await response.json();
        localStorage.setItem('user', JSON.stringify(userData));
    } catch (error){
        alert(error.message);
    }
}
