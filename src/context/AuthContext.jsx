import React, { createContext, useState, useEffect } from "react";


export const AuthContext = createContext();

// AuthProvider component to wrap the application
const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const fetchUserData = async () => {
        try {
            const storedRole = localStorage.getItem("role");
            if (storedRole) {
                setRole(storedRole);
            } else {
                logout();
            }
        } catch (error) {
            console.error("Failed to fetch user data", error);
            logout();
        }
    };

    // Load token from localStorage when the app starts
    useEffect(() => {
        const storedToken = localStorage.getItem("authToken");
        if (storedToken) {
            setToken(storedToken);
        }
    }, [token]);

    // Login function
    const login = (newToken) => {
        localStorage.setItem("authToken", newToken);
        setToken(newToken);
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem("authToken");
        setToken(null);
        setUser(null);
        setRole(null);
    };

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
