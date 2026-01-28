import React, { createContext, useState, useEffect, ReactNode } from 'react';
import type { IUser } from '../types';

interface AuthContextType {
    user: IUser | null;
    setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
    isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => { },
    isLoading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
