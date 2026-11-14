import page from "../../node_modules/page/page.mjs"
import { endpoint } from "./utility/endpoints.js"
import { getToken } from "./utility/utils.js"
import { showCreatePage } from "./views/create.js"
import { showDetailsPage } from "./views/details.js"
import { showEditPage } from "./views/edit.js"
import { showHomePage } from "./views/home.js"
import { showLoginPage } from "./views/login.js"
import { showProfilePage } from "./views/profile.js"
import { showRegisterPage } from "./views/register.js"

page('/', showHomePage);
page('/register', showRegisterPage);
page('/login', showLoginPage);
page('/create', showCreatePage);
page('/details/:id', showDetailsPage);
page('/edit/:id', showEditPage);
page('/profile', showProfilePage);

page.start();

export function updateNav() {
    const token = getToken();
    const userNav = document.getElementById('user');
    const guestNav = document.getElementById('guest');

    if (token) {
        userNav.style.display = '';
        guestNav.style.display = 'none';
    } else {
        userNav.style.display = 'none';
        guestNav.style.display = '';
    }
}

updateNav();

const logoutBtn = document.getElementById('logoutBtn');
logoutBtn.addEventListener('click', onLogout);

async function onLogout() {
    try {
        await fetch(endpoint.userURL + '/logout', {
            headers: {
                'X-Authorization': getToken()
            }
        })
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('email');
        sessionStorage.removeItem('userId');

        updateNav();
        page.redirect('/');
    } catch (error) {
        alert(error.message)
    }

}