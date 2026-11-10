import { userService } from "../api/userService.js";
import { routing, updateNav } from "../utils/routingModule.js";


export async function logoutView(){
    await userService.logout();
    updateNav();
    routing.goTo('/');
}