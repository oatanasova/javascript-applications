function solve() {

    const BASE_URL = 'http://localhost:3030/jsonstore/bus/schedule/';
    const infoBox = document.querySelector('#info span');
    const departBtn = document.getElementById('depart');
    const arriveBtn = document.getElementById('arrive');

    const stopInfo = {
        name: "",
        next: "depot"
    }

    async function depart() {
        try {
            const res = await fetch(BASE_URL + stopInfo.next);
            const data = await res.json();

            stopInfo.name = data.name;
            stopInfo.next = data.next;

            infoBox.textContent = `Next stop ${stopInfo.name}`;
            departBtn.disabled = true;
            arriveBtn.disabled = false;
        } catch (error) {
            infoBox.textContent = 'Error'
            departBtn.disabled = true;
            arriveBtn.disabled = true;
        }
    }

    function arrive() {
        infoBox.textContent = `Arriving at ${stopInfo.name}`;
        departBtn.disabled = false;
        arriveBtn.disabled = true;
    }

    return {
        depart,
        arrive
    };
}

let result = solve();