function attachEvents() {
    const BASE_URL = 'http://localhost:3030/jsonstore/phonebook';
    const output = document.getElementById('phonebook');
    const personRef = document.getElementById('person');
    const phoneRef = document.getElementById('phone');

    document.getElementById('btnLoad').addEventListener('click', onLoad);
    document.getElementById('btnCreate').addEventListener('click', onCreate);

    async function onLoad() {
        output.replaceChildren();
        try {
            const data = await getFetch(BASE_URL);

            Object.values(data).forEach(entry => {
                const li = document.createElement('li');
                li.textContent = `${entry.person}: ${entry.phone}`

                const delBtn = document.createElement('button');
                delBtn.textContent = "Delete";

                delBtn.addEventListener('click', async () => {
                    try {
                        await getFetch(`${BASE_URL}/${entry._id}`, { method: 'DELETE' });
                        li.remove();
                    } catch (error) {
                        console.error(error.message);
                    }
                })

                li.appendChild(delBtn);
                output.appendChild(li);
            });
        } catch (error) {
            console.error(error.message);
        }
    }

    async function onCreate() {
        const person = personRef.value;
        const phone = phoneRef.value;
        try {
            const data = await getFetch(BASE_URL,{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({person, phone})
            });
            personRef.value = '';
            phoneRef.value = '';

            await onLoad();

        } catch (error) {
            console.error(error.message);

        }
    }

    async function getFetch(url, params) {
        const response = await fetch(url, params);
        if (!response.ok) {
            throw new Error('Something went wrong');
        }

        if (response.status !== 204) {
            return response.json();
        }
    }
}

attachEvents();