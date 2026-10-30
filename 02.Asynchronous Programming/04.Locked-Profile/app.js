async function lockedProfile() {
    const main = document.getElementById('main');

    main.innerHTML = '';

    const response = await fetch('http://localhost:3030/jsonstore/advanced/profiles');
    const data = await response.json();

    let index = 1;
    for (let user of Object.values(data)) {
        const container = document.createElement('div');
        container.className = 'profile';

        container.innerHTML = `
        <img src="./iconProfile2.png" class="userIcon" />
				<label>Lock</label>
				<input type="radio" name="${user.username}Locked" value="lock" checked>
				<label>Unlock</label>
				<input type="radio" name="${user.username}Locked" value="unlock"><br>
				<hr>
				<label>Username</label>
				<input type="text" name="user${index++}Username" value="${user.username}" disabled readonly />
				<div class="${user.username}Username hiddenInfo">
					<hr>
					<label>Email:</label>
					<input type="email" name="${user.username}Email" value="${user.email}" disabled readonly />
					<label>Age:</label>
					<input type="number" name="${user.username}Age" value="${user.age}" disabled readonly />
                </div>
				
				<button>Show more</button>`;
        main.appendChild(container);
    };

    main.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
            const profile = event.target.parentElement;
            const radio = profile.querySelector('input[type="radio"][value="unlock"]');

            if (radio.checked) {
                if (event.target.textContent === 'Show more') {
                    event.target.textContent = 'Hide it';
                } else {
                    event.target.textContent = 'Show more';
                }
            profile.querySelector('div').classList.toggle('hiddenInfo');
            }
        }
    });
}