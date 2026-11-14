export function getToken() {
    return sessionStorage.getItem('token');
}

export function getUserId() {
    return sessionStorage.getItem('userId');
}