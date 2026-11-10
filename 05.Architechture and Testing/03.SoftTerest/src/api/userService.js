import { api } from "./requestor.js";
import { userUtils } from "../utils/userUtils.js";

const endpoints = {
    login: 'http://localhost:3030/users/login',
    register: 'http://localhost:3030/users/register',
    logout: 'http://localhost:3030/users/logout'
}

async function register(data){
    const userData = await api.post(endpoints.register, data);
    userUtils.storeUserData(userData);
    return userData;
}

async function login(data){
    const userData = await api.post(endpoints.login, data);
    userUtils.storeUserData(userData); //why not getaccesstoken?
    return userData;
}

async function logout(){
    await api.post(endpoints.logout);
    userUtils.clearUserData();
}

export const userService = {
    login,
    register,
    logout
}