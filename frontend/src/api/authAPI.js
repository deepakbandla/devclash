import api from './axios';

export const authAPI = {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials),
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
};

export default authAPI;
