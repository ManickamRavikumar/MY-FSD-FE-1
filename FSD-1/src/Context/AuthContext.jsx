import { createContext, useState, useEffect } from "react";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {   // children is props  innercomponent
    const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');  // token is get 
    return storedUser ? JSON.parse(storedUser) : null;

    });
    useEffect(() => {
        
        if (user) {
            localStorage.getItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user'); // remove user local storage  - logout.
        }
    }, [user]);

    const login = (userData) => {
        console.log("user logged in", userData);
        setUser(userData);  // token set 
    };
    const logout = () => {
        console.log("user logged out");
        setUser(null);  // token remove
        localStorage.removeItem('user');
    };
    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};