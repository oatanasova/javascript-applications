function storeUserData(userData) {
    const email = userData.email;
    const accessToken = userData.accessToken;
    const id = userData._id;

    sessionStorage.setItem('userData', JSON.stringify({ email, accessToken, id }));
}

function hasUser() {
    return !!sessionStorage.getItem('userData');
}

function getUserData() {
    return JSON.parse(sessionStorage.getItem('userData'));
}

function getAccessToken() {
    return getUserData().accessToken;
}

function clearUserData() {
    sessionStorage.removeItem('userData');
}

function hasOwner(itemOwnerId) {
    const id = getUserData()?.id;
    return id === itemOwnerId;
}

export const userUtils = {
    hasUser,
    getAccessToken,
    storeUserData,
    clearUserData,
    hasOwner
}