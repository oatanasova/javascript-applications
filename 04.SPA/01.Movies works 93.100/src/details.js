import { showView } from "./utils.js";
import { homePage } from "./home.js";
import { editPage } from "./edit.js";

const section = document.getElementById('movie-example');

export function detailsPage(id) {
    showView(section);
    displayMovie(id);
}

async function displayMovie(id) {
    const user = JSON.parse(localStorage.getItem('user'));
    const [movie, likes, ownLike] = await Promise.all([
        getMovie(id),
        getLikes(id),
        getOwnLike(id, user)
    ]);

    section.replaceChildren(createMovieCard(movie, user, likes, ownLike));
}

function createMovieCard(movie, user, likes, ownLike) {
    const divEl = document.createElement('div');
    divEl.className = 'container';

    divEl.innerHTML = `
    <div class="row bg-light text-dark">
        <h1>Movie title: ${movie.title}</h1>
        <div class="wrapper">
        <div class="col-md-8">
            <img class="img-thumbnail" src="${movie.img}" alt="Movie" />
        </div>
        <div class="col-md-4 text-center">
            <h3 class="my-3">Movie Description</h3>
            <p> ${movie.description} </p>
            ${createControls(movie, user, ownLike)}
            <span class="enrolled-span">Liked ${likes}</span>
        </div>
        </div>
    </div>`;

    const likedBtn = divEl.querySelector('.like-btn');
    if(likedBtn){
        likedBtn.addEventListener('click', (event)=> likeMovie(event, movie._id));
    }

    return divEl;
}

async function likeMovie(event, movieId){
    event.preventDefault();
    //TODO TRY CATCH 
        try {
        const user = JSON.parse(localStorage.getItem('user'));
        const url = `http://localhost:3030/data/likes`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "X-Authorization": user.accessToken || ""
            },
            body: JSON.stringify({ movieId }),
        })
        if (!response.ok) {
            throw new Error("Failed to like");
        }
        detailsPage(movieId);
    } catch (error) {
        alert(error.message);
    }
}

function createControls(movie, user, ownLike) {
    const isOwner = user && user._id === movie._ownerId;
    const controls = [];
    if (isOwner) {
        controls.push(`<a class="btn btn-danger" id="${movie._id}" href="#">Delete</a>`);
        controls.push(`<a class="btn btn-warning" id="${movie._id}" href="#">Edit</a>`);

    } else if (user && ownLike === false) {
        controls.push(`<a class="btn btn-primary like-btn" href="#">Like</a>`);
    }

    return controls.join('')
}

async function getMovie(id) {
    const url = `http://localhost:3030/data/movies/${id}`;

    //TODO: add try-catch
    const response = await fetch(url);
    const movie = await response.json();
    return movie;
}

async function getLikes(id) {
    const url = `http://localhost:3030/data/likes?where=movieId%3D%22${id}%22&distinct=_ownerId&count`;

    //TODO: add try-catch
    const response = await fetch(url);
    const likes = await response.json();
    return likes;
}

async function getOwnLike(movieId, user) {
    if (!user) {
        return false;
    }

    const userId = user._id;
    const url = `http://localhost:3030/data/likes?where=movieId%3D%22${movieId}%22%20and%20_ownerId%3D%22${userId}%22 `;

    //TODO: add try-catch
    const response = await fetch(url);
    const likes = await response.json();
    return likes?.length > 0;
}

section.addEventListener('click', async (event) => {
    event.preventDefault();
    const { id } = event.target;
    if(event.target.tagName === "A" && event.target.textContent === "Delete"){
        await deleteMovie(id);
        homePage();
    }
})

async function deleteMovie(id) {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const url = `http://localhost:3030/data/movies/${id}`;

        //TODO: add try-catch
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "X-Authorization": user.accessToken || ""
            },
        });
        if (!response.ok) {
            throw new Error("Failed to delete");
        }
    } catch (error) {
        homePage();
        alert(error.message);
    }
}


section.addEventListener('click', (event) => { //async ??
    event.preventDefault();
    const { id } = event.target;
    if(event.target.tagName === "A" && event.target.textContent === "Edit"){
        editPage(id);
    }
})