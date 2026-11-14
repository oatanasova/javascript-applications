import { html, render } from "../../node_modules/lit-html/lit-html.js"
import page from "../../node_modules/page/page.mjs"
import { endpoint } from "../utility/endpoints.js";
import { getToken, getUserId } from "../utility/utils.js";

const mainEl = document.querySelector('main');

export async function showDetailsPage(ctx) {
    const furnitureId = ctx.params.id;
    const furnitureDetails = await getDetails(furnitureId)

    const userId = getUserId();
    const isOwner = userId === furnitureDetails._ownerId;
    render(detailsTemplate(furnitureDetails, isOwner), mainEl);
}

async function getDetails(furnitureId) {
    try {
        const res = await fetch(`${endpoint.furnitureURL}/${furnitureId}`);
        const data = await res.json();
        return data;
    } catch (error) {
        alert(error.message);
    }
}

function detailsTemplate(furniture, isOwner) {
    return html`
    <div class="container">
        <div class="row space-top">
            <div class="col-md-12">
                <h1>Furniture Details</h1>
            </div>
        </div>
        <div class="row space-top">
            <div class="col-md-4">
                <div class="card text-white bg-primary">
                    <div class="card-body">
                        <img src=${furniture.img} />
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <p>Make: <span>${furniture.make}</span></p>
                <p>Model: <span>${furniture.model}</span></p>
                <p>Year: <span>${furniture.year}</span></p>
                <p>Description: <span>${furniture.description}</span></p>
                <p>Price: <span>${furniture.price}</span></p>
                <p>Material: <span>${furniture.material}</span></p>

                ${isOwner ? 
                    html `
                    <div>
                        <a href="/edit/${furniture._id}" class="btn btn-info">Edit</a>
                        <a class="btn btn-red" id=${furniture._id} @click=${onDelete}>Delete</a>
                    </div>
                    `
                    : "" }

            </div>
        </div>
    </div>
    `;
}


async function onDelete(e) {
    const furnitureId = e.target.id;

    const confirmDelete = confirm('Are you sure?');
    if (confirmDelete) {
        try {
            await fetch(`${endpoint.furnitureURL}/${furnitureId}`, {
                method: 'DELETE',
                headers: {
                    'X-Authorization': getToken()
                }
            })
            page.redirect('/')
        } catch (error) {
            alert(error.message);
        }
    }
}
