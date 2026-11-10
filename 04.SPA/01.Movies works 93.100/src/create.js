import { showView } from "./utils.js";
import { homePage } from "./home.js"; 

const section = document.getElementById('add-movie');
const form = section.querySelector('form');

form.addEventListener('submit', onSubmit)

export function createPage(){
    showView(section);
}

async function onSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(form);
    const title = formData.get('title');
    const description = formData.get('description');
    const img = formData.get('img');

    if (!title || !description || !img) {
        alert("All field are required");
        return;
    }

    await createMovie(title, description, img);
    form.reset();
    homePage();
}

async function createMovie(title, description, img) {
    const user = JSON.parse(localStorage.getItem('user'));

    try {
        const url = "http://localhost:3030/data/movies";
        const response = await fetch(url, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "X-Authorization": user.accessToken || ""
             },
            body: JSON.stringify({ title, description, img }),
        });

        if(response.status !== 200 || !response.ok){
            throw new Error("Failed to create movie");
        }
        // const userData = await response.json();
        // localStorage.setItem('user', JSON.stringify(userData));
    } catch (error){
        alert(error.message);
    }
}