import { createContext, useState } from 'react';
import { IAuthContext } from 'interfaces/authContext';

export const AuthContext = createContext<IAuthContext>({
    user: null,
    signup: () => {},
    login: () => {},
    logout: () => {},
    setUserLS: () => {}
});

type props = {
    children: JSX.Element | JSX.Element[];
}

export function AuthContextProvider({ children }: props) {
    const [user, setUser] = useState<any>(() => {
        try { return JSON.parse(localStorage.getItem('user') || 'null'); }
        catch { return null; }
    });

    const signup = (email: string, _password: string) => {
        const newUser = { email };
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        return Promise.resolve();
    };

    const login = (email: string, _password: string) => {
        const loggedUser = { email };
        setUser(loggedUser);
        localStorage.setItem('user', JSON.stringify(loggedUser));
        return Promise.resolve();
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        return Promise.resolve();
    };

    const setUserLS = () => localStorage.setItem('user', JSON.stringify(user));

    return (
        <AuthContext.Provider value={{ user, signup, login, logout, setUserLS }}>
            {children}
        </AuthContext.Provider>
    );
}
