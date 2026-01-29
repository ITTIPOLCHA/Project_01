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
    // Extract remember flag if present (default to true if not specified, or handle in UI)
    const { remember, ...credentials } = userData;

    const response = await api.post(API_URL + '/login', credentials);

    if (response.data) {
        if (remember) {
            localStorage.setItem('user', JSON.stringify(response.data));
        } else {
            sessionStorage.setItem('user', JSON.stringify(response.data));
        }
    }

    return response.data;
};

const logout = () => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
};

const authService = {
    register,
    login,
    logout,
};

export default authService;
