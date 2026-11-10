import { userUtils } from "../utils/userUtils.js";

async function requestor(method, url, data) {
    const option = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    }

    if(userUtils.hasUser()){
        option.headers["X-Authorization"] = userUtils.getAccessToken();
    }

    if(data){
        option.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, option)

        if(!response.ok){
            if(response.status === 403){
                sessionStorage.clear();
            }
            const err = response.json();
            throw new Error(err.message);
        }
        if(response.status === 204){
            return response;
        }
        const data = await response.json();
        return data;
    } catch (error) {
        alert(error);
    }
}

function get(url){
    return requestor("GET", url);
}

function post(url, data){
    return requestor("POST", url, data);
}

function put(url){
    return requestor("PUT", ur, data);
}

function del(url){
    return requestor("DELETE", url);
}

export const api = {
    get,
    post, 
    put, 
    del
}