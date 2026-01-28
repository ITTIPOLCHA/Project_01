import api from './api';

const API_URL = '/auth';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const register = async (userData: any) => {
    const response = await api.post(API_URL + '/register', userData);

    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }

    return response.data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const login = async (userData: any) => {
    const response = await api.post(API_URL + '/login', userData);

    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }

    return response.data;
};

const logout = () => {
    localStorage.removeItem('user');
};

const authService = {
    register,
    login,
    logout,
};

export default authService;
