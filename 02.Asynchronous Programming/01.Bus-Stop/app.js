async function getInfo() {
    const BASE_URL = "http://localhost:3030/jsonstore/bus/businfo/";
    const inputRef = document.getElementById("stopId");
    const stopNameRef = document.getElementById("stopName");
    const busesListRef = document.getElementById("buses");

    let input = inputRef.value;

    inputRef.value = '';
    busesListRef.innerHTML = '';

    try {
        let response = await fetch(BASE_URL + input);

        let data = await response.json();

        stopNameRef.textContent = data.name;
        Object.entries(data.buses).forEach(([busId, time]) => {
            const li = document.createElement("li");
            li.textContent = `Bus ${busId} arrives in ${time} minutes`;
            busesListRef.appendChild(li);
        })
    } catch (err) {
        stopNameRef.textContent = 'Error';
    }
}

// function getInfo() {
//     const BASE_URL = "http://localhost:3030/jsonstore/bus/businfo/";
//     const inputRef = document.getElementById("stopId");
//     const stopNameRef = document.getElementById("stopName");
//     const busesListRef = document.getElementById("buses");

//     let input = inputRef.value;
//     inputRef.value = '';
//     busesListRef.innerHTML = '';
//     const response = fetch(BASE_URL + input)
//     .then(data => {
//         data.json()
//         .then(busStopInfo => {
//             stopNameRef.textContent = busStopInfo.name;
//             Object.entries(busStopInfo.buses).forEach(([busId, time]) => {
//                 const li = document.createElement("li");
//                 li.textContent = `Bus ${busId} arrives in ${time} minutes`;
//                 busesListRef.appendChild(li);
//             })
//         })
//         .catch(err => {
//             stopNameRef.textContent = 'Error';
//         })
//     })
//     .catch(err)
// }
