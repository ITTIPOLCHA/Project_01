import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Login from '../Login';
import { AuthContext } from '../../context/AuthContext';
import authService from '../../services/authService';
import { BrowserRouter } from 'react-router-dom';

// Mock authService
vi.mock('../../services/authService', () => ({
    default: {
        login: vi.fn(),
    },
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('Login Page', () => {
    const mockSetUser = vi.fn();

    const renderLogin = () => {
        render(
            <AuthContext.Provider value={{ user: null, setUser: mockSetUser, isLoading: false }}>
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            </AuthContext.Provider>
        );
    };

    it('renders login form', () => {
        renderLogin();
        expect(screen.getByPlaceholderText('อีเมล')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('รหัสผ่าน')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /เข้าสู่ระบบ/i })).toBeInTheDocument();
    });

    it('calls login service and redirects on success', async () => {
        (authService.login as any).mockResolvedValueOnce({ name: 'User', token: 'token' });
        renderLogin();

        fireEvent.change(screen.getByPlaceholderText('อีเมล'), { target: { value: 'test@test.com' } });
        fireEvent.change(screen.getByPlaceholderText('รหัสผ่าน'), { target: { value: 'password' } });
        fireEvent.click(screen.getByRole('button', { name: /เข้าสู่ระบบ/i }));

        await waitFor(() => {
            expect(authService.login).toHaveBeenCalledWith({ email: 'test@test.com', password: 'password' });
            expect(mockSetUser).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });
});
