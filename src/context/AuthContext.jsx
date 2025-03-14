import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Added import for decoding JWT

export const AuthContext = createContext();

// AuthProvider component to wrap the application
const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

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

    useEffect(() => {
        const storedToken = localStorage.getItem("authToken");
        if (storedToken) {
            setToken(storedToken);

            // Decode token to get user role
            try {
                const decoded = jwtDecode(storedToken);
                setUser({ id: decoded.userId, email: decoded.email });
                setRole(decoded.role);
                setIsAdmin(decoded.role === "admin"); // Added isAdmin state update
            } catch (error) {
                console.error("Invalid token", error);
                logout();
            }
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
        setIsAdmin(false); // Reset isAdmin on logout
    };

    return (
        <AuthContext.Provider value={{ token, user, role, isAdmin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
