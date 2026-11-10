const views = document.querySelectorAll('.view-section');

function hideAllViews() {
    views.forEach(v => v.style.display = 'none');
}


export function showView(section) {
    hideAllViews();
    section.style.display = 'block';
}

export function updateNav() {
// TODO get user from localstorage
    const user = JSON.parse(localStorage.getItem('user'));
    // const user = { email: 'ee@ee.com'};
    // const user = getUserData();
    // const isLoggedIn = true;

    const userNavEl = document.querySelectorAll(".user");
    const guestNavEl = document.querySelectorAll(".guest");
    const msgContainer = document.getElementById("welcome-msg");

    if (user) {
        // show user
        userNavEl.forEach((e) => (e.style.display = "inline"));
        // hide guest
        guestNavEl.forEach((e) => (e.style.display = "none"));
        // welocome the logged in user
        msgContainer.textContent = `Welcome, ${user.email}`;
    } else {
        // hide user
        userNavEl.forEach((e) => (e.style.display = "none"));
        // show guest
        guestNavEl.forEach((e) => (e.style.display = "inline"));
        msgContainer.textContent = '';
    }
}