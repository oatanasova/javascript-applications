import { html, render } from "../../node_modules/lit-html/lit-html.js"
import page from "../../node_modules/page/page.mjs"
import { endpoint } from "../utility/endpoints.js";
import { getToken } from "../utility/utils.js";

const mainEl = document.querySelector('main');

export async function showEditPage(ctx) {
    const furnitureId = ctx.params.id;
    const furniture = await getDetails(furnitureId)
    render(editTemplate(furniture), mainEl);
}

function editTemplate(furniture) {
    return html`
    <div class="container">
        <div class="row space-top">
            <div class="col-md-12">
                <h1>Edit Furniture</h1>
                <p>Please fill all fields.</p>
            </div>
        </div>
        <form @submit=${(e) => onEdit(e, furniture)}>
            <div class="row space-top">
                <div class="col-md-4">
                    <div class="form-group">
                        <label class="form-control-label" for="new-make">Make</label>
                        <input class="form-control" id="new-make" type="text" name="make" value=${furniture.make}>
                    </div>
                    <div class="form-group has-success">
                        <label class="form-control-label" for="new-model">Model</label>
                        <input class="form-control" id="new-model" type="text" name="model" value=${furniture.model}>
                    </div>
                    <div class="form-group has-danger">
                        <label class="form-control-label" for="new-year">Year</label>
                        <input class="form-control" id="new-year" type="number" name="year" value=${furniture.year}>
                    </div>
                    <div class="form-group">
                        <label class="form-control-label" for="new-description">Description</label>
                        <input class="form-control" id="new-description" type="text" name="description" value=${furniture.description}>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                        <label class="form-control-label" for="new-price">Price</label>
                        <input class="form-control" id="new-price" type="number" name="price" value=${furniture.price}>
                    </div>
                    <div class="form-group">
                        <label class="form-control-label" for="new-image">Image</label>
                        <input class="form-control" id="new-image" type="text" name="img" value=${furniture.img}>
                    </div>
                    <div class="form-group">
                        <label class="form-control-label" for="new-material">Material (optional)</label>
                        <input class="form-control" id="new-material" type="text" name="material" value=${furniture.material}>
                    </div>
                    <input type="submit" class="btn btn-info" value="Edit" />
                </div>
            </div>
        </form>
    </div>
    `;
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

async function onEdit(e, furniture) {
    e.preventDefault();

    const allInput = Array.from(e.currentTarget.querySelectorAll('.form-control'));
    let hasErrors = false;

    allInput.forEach(input => {
        if (!validateInput(input)) {
            hasErrors = true;
        }
    });

    if (hasErrors) {
        alert('Invalid data!');
        return;
    }

    const formData = new FormData(e.currentTarget);
    const furnitureData = Object.fromEntries(formData);

    furnitureData.year = Number(furnitureData.year);
    furnitureData.price = Number(furnitureData.price);

    try {
        const res = await fetch(`${endpoint.furnitureURL}/${furniture._id}`, {
            method: 'PUT',
            headers: {
                'X-Authorization': getToken(),
                'Content-type': 'application/json'
            },
            body: JSON.stringify(furnitureData)
        });

        const data = await res.json();

        page.redirect(`/details/${furniture._id}`);
    } catch (error) {
        alert(error.message)
    }

}

function validateInput(input) {
    let value = input.value.trim();
    const inputName = input.name;
    let isValid = true;

    switch (inputName) {
        case 'make':
        case 'model':
            isValid = value.length >= 4;
            break;
        case 'year':
            value = Number(value);
            isValid = value >= 1950 && value <= 2050;
            break;
        case 'description':
            isValid = value.length > 10;
            break;
        case 'price':
            value = Number(value);
            isValid = value > 0;
            break;
        case 'img':
            isValid = value.length > 0;
            break;
    }

    if (isValid) {
        input.classList.add('is-valid');
        input.classList.remove('is-invalid');
    } else {
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
    }

    return isValid;
}