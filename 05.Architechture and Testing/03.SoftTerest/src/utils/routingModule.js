import { userUtils } from "./userUtils.js";
import { showCreateView } from "../views/createView.js";
import { showDashboardView } from "../views/dashboardView.js";
import { showDetailsView } from "../views/detailsView.js";
import { showHomeView } from "../views/homeView.js";
import { showLoginView } from "../views/loginView.js";
import { logoutView } from "../views/logoutView.js";
import { showRegisterView } from "../views/registerView.js";

document.querySelector('nav').addEventListener('click', onNavigate);

const routes = {
    '/': showHomeView,
    '/login': showLoginView,
    '/register': showRegisterView,
    '/logout': logoutView,
    '/dashboard': showDashboardView,
    '/create': showCreateView,
    '/details': showDetailsView
}

export function updateNav(){
    const hasUser = userUtils.hasUser();
    const userNav = document.querySelectorAll('nav a[data-user]');
    const guestNav = document.querySelectorAll('nav a[data-guest]');
    if(hasUser){
        userNav.forEach(a => a.style.display = 'block');
        guestNav.forEach(a => a.style.display = 'none');
    } else {
        userNav.forEach(a => a.style.display = 'none');
        guestNav.forEach(a => a.style.display = 'block');
    }
}

function onNavigate(e) {
    e.preventDefault();
    let target = e.target;

    if (target.tagName === "IMG") {
        target = target.parentElement;
    }
    if (target.tagName !== "A" || !target.href) {
        return;
    }

    const url = new URL(target.href);
    const viewname = url.pathname;

    goTo(viewname);
}

function goTo(handlerName, ...params) {
    const handler = routes[handlerName];
    handler(params);
}

export const routing ={
    goTo
}