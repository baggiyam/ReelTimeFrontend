import { NavLink } from "react-router-dom";
import React, { useContext } from "react";
import "../Styles/index.css";
import logo from "../images/Logo.jpeg";
import { AuthContext } from "../src/context/AuthContext";

function Navbar() {
    const { token, logout } = useContext(AuthContext)
    console.log('Token passed to Navbar:', token);  // Log the token to the console

    return (
        <nav id="main-navbar">
            <NavLink to="/" className="logo">
                <img src={logo} alt="Logo" className="logo-image" />
            </NavLink>

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
                            onClick={logout}
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
