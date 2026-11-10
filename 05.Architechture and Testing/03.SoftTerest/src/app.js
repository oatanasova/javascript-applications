import { routing, updateNav } from "./utils/routingModule.js";

Array.from(document.querySelectorAll('div[data-section]')).forEach(section => section.remove());
// document.querySelector('footer').remove(); //temporary, do not forget to remove

updateNav();
routing.goTo('/');
