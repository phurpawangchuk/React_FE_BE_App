import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:8080/api'
});

export const api3000 = axios.create({
    baseURL: 'http://localhost:3000/api'
});

export const api80 = axios.create({
    baseURL: 'http://localhost/smartcard_backend/public/api'
});

export default api