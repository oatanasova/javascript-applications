function attachEvents() {

    const BASE_URL = 'http://localhost:3030/jsonstore/forecaster/';
    const inputRef = document.getElementById('location');
    const forecastContainer = document.getElementById('forecast');
    const currentRef = document.getElementById('current');
    const upcomingRef = document.getElementById('upcoming');
    document.getElementById('submit').addEventListener('click', onSubmit);
    // const submitBtn = document.getElementById('submit').addEventListener('click', onSubmit);

    const endURL = {
        "location": "locations",
        "today": (code) => `today/${code}`,
        "upcoming": (code) => `upcoming/${code}`
    }

    const symbols = {
        "Sunny": '&#x2600;',
        "Partly sunny": '&#x26C5;',
        "Overcast": '&#x2601;',
        "Rain": '&#x2614;',
        "degrees": '&#176;',
    }

    async function onSubmit(e) {
        try {
            
            const response = await fetch(BASE_URL + endURL.location);
            const data = await response.json();
            
            forecastContainer.style.display = "block";
            
            const userLocation = data.find(x => x.name === inputRef.value);

            showCurrent(userLocation.code);
            showUpcoming(userLocation.code);

        } catch (error) {
            const p = document.createElement('p');
            p.textContent = 'Error';
            forecastContainer.style.display = "block";
            currentRef.appendChild(p);
        }
    }

    async function showCurrent(code) {
        const response = await fetch(BASE_URL + endURL.today(code));
        const data = await response.json();

        const forecast = data.forecast;

        const container = document.createElement('div');
        container.classList.add('forecasts');

        container.innerHTML = `
        <span class="condition symbol">${symbols[forecast.condition]}</span>
        <span class="condition">
            <span class="forecast-data">${data.name}</span>
            <span class="forecast-data">${forecast.low}${symbols["degrees"]}/${forecast.high}${symbols["degrees"]}</span>
            <span class="forecast-data">${forecast.condition}</span>
        </span>`;

        currentRef.appendChild(container);
    }

    async function showUpcoming(code) {
        const response = await fetch(BASE_URL + endURL.upcoming(code));
        const data = await response.json();

        const container = document.createElement('div');
        container.classList.add('forecast-info');

        data.forecast.forEach((data) => {
            
        const span = document.createElement('span');
        span.className = 'upcoming';
            span.innerHTML += `
                <span class="symbol">${symbols[data.condition]}</span>
                <span class="forecast-data">${data.low}${symbols["degrees"]}/${data.high}${symbols["degrees"]}</span>
                <span class="forecast-data">${data.condition}</span>           
            `;
    
            container.appendChild(span);
        });

        upcomingRef.appendChild(container)
    }

}

attachEvents();