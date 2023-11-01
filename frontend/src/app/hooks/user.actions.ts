import {UserDataIFace} from "../types";

export function getUser() {
    const auth:UserDataIFace = JSON.parse(localStorage.getItem("auth")!);
    if (auth) {
        return auth.user;
    }
    return null
}


export function getAccessToken() {
    const auth:UserDataIFace = JSON.parse(localStorage.getItem("auth")!);
    if (auth && auth.access) return auth.access;
    return;
}


export function getRefreshToken() {
    const auth:UserDataIFace = JSON.parse(localStorage.getItem("auth")!);
    return auth.refresh;
}


export function setUserData(data: UserDataIFace) {
    localStorage.setItem("auth", JSON.stringify({
        access: data.access,
        refresh: data.refresh,
        user: data.user,
    }))
}

export function logout() {
    localStorage.removeItem("auth")
}