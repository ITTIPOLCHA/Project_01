import { describe, it, expect, vi, beforeEach } from 'vitest';
import authService from '../authService';
import api from '../api';

// Mock the api module
vi.mock('../api', () => ({
    default: {
        post: vi.fn(),
    },
}));

describe('authService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('login calls api.post and stores user in localStorage', async () => {
        const mockUser = { name: 'Test User', token: 'mock-token' };
        // Mock successful API response
        (api.post as any).mockResolvedValueOnce({ data: mockUser });

        const userData = { email: 'test@example.com', password: 'password123', remember: true };
        const result = await authService.login(userData);

        // Expected API call DOES NOT include 'remember'
        const expectedCredentials = { email: 'test@example.com', password: 'password123' };
        expect(api.post).toHaveBeenCalledWith('/auth/login', expectedCredentials);

        expect(result).toEqual(mockUser);
        expect(localStorage.getItem('user')).toEqual(JSON.stringify(mockUser));
    });

    it('register calls api.post and stores user in localStorage', async () => {
        const mockUser = { name: 'New User', token: 'new-token' };
        (api.post as any).mockResolvedValueOnce({ data: mockUser });

        const userData = { name: 'New User', email: 'new@example.com', password: 'password123' };
        const result = await authService.register(userData);

        expect(api.post).toHaveBeenCalledWith('/auth/register', userData);
        expect(result).toEqual(mockUser);
        expect(localStorage.getItem('user')).toEqual(JSON.stringify(mockUser));
    });

    it('logout removes user from localStorage', () => {
        localStorage.setItem('user', JSON.stringify({ token: 'old-token' }));

        authService.logout();

        expect(localStorage.getItem('user')).toBeNull();
    });
});
