import React, { createContext, useState, useEffect } from "react";


export const AuthContext = createContext();

// AuthProvider component to wrap the application
const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);

    // Load token from localStorage when the app starts
    useEffect(() => {
        const storedToken = localStorage.getItem("authToken");
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    // Login function
    const login = (newToken) => {
        localStorage.setItem("authToken", newToken);
        setToken(newToken);
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem("authToken");
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
