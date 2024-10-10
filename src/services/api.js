import axios from 'axios';

export const api = axios.create({
    baseURL: process.env.BASE_URL,
    json: true,
});

export const dh = axios.create({
    baseURL: process.env.BASE,
    json: true,
});