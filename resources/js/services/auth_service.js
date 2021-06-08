import {http, httpFile} from "./http_service";
import jwt from 'jsonwebtoken';
import store from '../store';

export function register(user) {
    return http().post('/auth/register', user)
}

export function login(user) {
    return http().post('/auth/login', user)
        .then(response => {
            if(response.status === 200){
                setTokken(response.data)
            }
            return response.data;
        })
}

function setTokken(user) {
    const token = jwt.sign({user:user}, 'laravelvuespaghhghhgsoftgear2020');
    //localStorage.setItem('laravel-vue-spa-token', JSON.stringify(user));
    localStorage.setItem('laravel-vue-spa-token', token);
    store.dispatch('authenticate', user.user)
}
export function isLoggedIn(){
    const token = localStorage.getItem('laravel-vue-spa-token');
    return token != null;
}

export function logout(){
    http().get('auth/logout');
    localStorage.removeItem('laravel-vue-spa-token');
}

export function getAccessToken() {
    const token = localStorage.getItem('laravel-vue-spa-token');
    if(!token){
        return null
    }

    const tokenData = jwt.decode(token);
    return tokenData.user.access_token;
}

export function getUserRole() {
    const token = localStorage.getItem('laravel-vue-spa-token');
    if(!token){
        return null
    }

    const tokenData = jwt.decode(token);
    return tokenData.user.user.role;
}

export function getProfile() {
    return http().get('/auth/profile');
}


