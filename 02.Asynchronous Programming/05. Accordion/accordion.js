// window.onload = solution;

async function solution() {
    const BASE_URL = 'http://localhost:3030/jsonstore/advanced/articles/'
    const main = document.getElementById('main');

    const response = await fetch(BASE_URL + 'list');
    const data = await response.json();

    for (let item of data) {
        const container = document.createElement('div');
        container.className = 'accordion';

        container.innerHTML = `
            <div class="head">
                <span>${item.title}</span>
                <button class="button" id=${item._id}>More</button>
            </div>
            `;
        main.appendChild(container);
    }

    main.addEventListener('click', onClick);

    async function onClick(event) {
        const selected = event.target;
        const id = selected.id;
        const parent = selected.parentElement.parentElement;

        if (selected.tagName !== 'BUTTON' ){
            return;
        }
        if(selected.textContent === 'More') {
            const response = await fetch(BASE_URL + 'details/' + id);
            const data = await response.json();

            const div = document.createElement('div');
            div.className = 'extra';

            const p = document.createElement('p');
            p.textContent = data.content;

            div.style.display = 'block';
            selected.textContent = 'Less';

            div.appendChild(p);
            parent.appendChild(div);

        } else {
            selected.textContent = 'More';
            parent.querySelector('.extra').remove();
        }
    }
}

solution();