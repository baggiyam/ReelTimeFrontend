import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import React, { useContext } from "react";
import "../Styles/index.css";
import logo from "../images/Logo.jpeg";
import { AuthContext } from "../src/context/AuthContext";
import { slide as Menu } from 'react-burger-menu';

function Navbar() {
    const navigate = useNavigate();
    const { token, logout } = useContext(AuthContext)
    console.log('Token passed to Navbar:', token);
    const [open, setOpen] = useState(false)


    useEffect(() => {
        const handleScroll = () => {
            setOpen(false);
        };
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".bm-menu") && !event.target.closest(".bm-burger-button")) {
                setOpen(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);
    const handleStateChange = (state) => {
        setOpen(state.isOpen);
    };

    const closeMenu = () => {
        setOpen(false);
    };
    const handleLogout = () => {
        logout(); // Clear token
        closeMenu(); // Close burger menu
        navigate("/", { state: { message: "Successfully logged out" } });
    };

    return (
        <div id="main-navbar">
            <NavLink to="/" className="logo">
                <img src={logo} alt="Logo" className="logo-image" />
            </NavLink>
            <Menu
                right
                isOpen={open}
                onStateChange={handleStateChange}
                onClose={closeMenu}
            >
                <div className="nav-links">
                    <NavLink
                        to="/"
                        className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}
                    >
                        Home
                    </NavLink>
                    {/* Conditionally render Login and Signup if no token, otherwise render Movie List and others */}
                    {!token ? (
                        <>
                            <NavLink
                                to="/login"
                                className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}
                            >
                                Login
                            </NavLink>
                            <NavLink
                                to="/signup"
                                className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}
                            >
                                Signup
                            </NavLink>
                        </>
                    ) : (
                        <>
                            <NavLink
                                to="/movielist"
                                className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}
                            >
                                MovieList
                            </NavLink>
                            <NavLink
                                to="/watchlist"
                                className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}
                            >
                                Watchlist
                            </NavLink>
                            <NavLink
                                to="/favorites"
                                className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}
                            >
                                Favorites
                            </NavLink>
                            <NavLink
                                to="/watched"
                                className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}
                            >
                                Watched
                            </NavLink>
                            <NavLink
                                to="/addmovie"
                                className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}
                            >
                                AddMovies
                            </NavLink>
                            <button
                                className="nav-link logout-btn"
                                onClick={handleLogout}

                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </Menu>
        </div>
    );
}

export default Navbar;
