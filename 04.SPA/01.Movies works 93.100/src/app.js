import { createPage } from "./create.js";
import { homePage } from "./home.js"
import { loginPage } from "./login.js";
import { logout } from "./logout.js";
import { registerPage } from "./register.js";
import { updateNav } from "./utils.js";

const routes = {
    "/": homePage,
    "/login": loginPage,
    "/register": registerPage,
    "/create": createPage,
    "/logout": logout
};

document.querySelector('nav').addEventListener('click', navigateHandler);
document.querySelector('#add-movie-button a').addEventListener('click', navigateHandler);

function navigateHandler(event) {
    if (event.target.tagName == 'A' && event.target.href) {
        event.preventDefault();

        const url = new URL(event.target.href.toString());
        const path = url.pathname;
        const renderView = routes[path];

        if (typeof renderView == 'function') {
            renderView();
        }
    }
}


//On innitial page load
updateNav();
homePage();
// routes['/login']();
// routes['/register']();
// routes['/logout']();
// routes['/create']();