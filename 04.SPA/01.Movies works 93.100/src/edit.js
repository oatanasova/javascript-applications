import { showView } from "./utils.js";
import { detailsPage } from "./details.js";

const section = document.getElementById('edit-movie');
const form = section.querySelector('form');

export async function editPage(id) {
    showView(section);

    const url = `http://localhost:3030/data/movies/${id}`;
    const response = await fetch(url);
    const movie = await response.json();

    section.querySelector('[name="title"]').value = movie.title;
    section.querySelector('[name="description"]').value = movie.description;
    section.querySelector('[name="img"]').value = movie.img;

    form.setAttribute('id', id);
    form.addEventListener('submit', editMovie);
}

async function editMovie(event) {
    event.preventDefault();

    const formData = new FormData(form);
    const title = formData.get('title');
    const description = formData.get('description');
    const img = formData.get('img');

    if (!title || !description || !img) {
        alert("All field are required");
        return;
    }

    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const url = `http://localhost:3030/data/movies/${event.target.id}`;
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-Authorization": user.accessToken || ""
            },
            body: JSON.stringify({ title, description, img }),
        })
        if (!response.ok) {
            throw new Error("Failed to edit");
        }
        detailsPage(event.target.id);
    } catch (error) {
        alert(error.message);
    }
    
}

