import { loginPage } from "./login.js";
import { updateNav } from "./utils.js";

// export async function logout() {
//     // localStorage.removeItem('user');
//     await logoutRequest();
//     updateNav();
//     homePage();
// }

// async function logoutRequest(email, password) {
//     try {
//         const user = JSON.parse(localStorage.getItem('user'));
//         const url = "http://localhost:3030/users/logout";
//         const response = await fetch(url, {
//             method: "GET",
//             headers:{
//                 // "Content-Type": "application/json",
//                 "X-Authorization": user.accessToken || ""
//             }
//         });

//         if (!response.ok) {
//             throw new Error('Logout failed');
//         }
//         const userData = await response.json();
//         localStorage.removeItem('user');

//     } catch (error) {
//         alert(error.message);
//     }
// }
export async function logout() {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const url = "http://localhost:3030/users/logout";

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "X-Authorization": user.accessToken
            }
        });

        if (!response.ok) {
            throw new Error('Logout failed');
        }

        localStorage.removeItem('user');
        updateNav();
        loginPage();

    } catch (error) {
        alert(error.message);
    }
}