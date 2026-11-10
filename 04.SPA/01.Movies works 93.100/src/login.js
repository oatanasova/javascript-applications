import { homePage } from "./home.js";
import { showView , updateNav} from "./utils.js";

const section = document.getElementById('form-login');
const form = section.querySelector('form');

form.addEventListener('submit', onSubmit)

export function loginPage(){
    showView(section);
}

// export function registerPage() {
//     showView(section);
// }

async function onSubmit(event) {
    event.preventDefault();
    const formData = new FormData(form);
    const email = formData.get('email');
    const password = formData.get('password');

    await login(email, password);
    form.reset();
    updateNav();
    homePage();
}

async function login(email, password) {
    try {
        const url = "http://localhost:3030/users/login";
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if(!response.ok){
            throw new Error("Failed to login");
        }
        const userData = await response.json();
        localStorage.setItem('user', JSON.stringify(userData));

    } catch (error){
        alert(error.message);
    }
}
