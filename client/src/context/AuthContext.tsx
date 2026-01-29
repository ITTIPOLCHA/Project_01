import React, { createContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { IUser } from '../types';

interface AuthContextType {
    user: IUser | null;
    setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
    isLoading: boolean;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => { },
    isLoading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(() => {
        const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const isLoading = false;

    return (
        <AuthContext.Provider value={{ user, setUser, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
