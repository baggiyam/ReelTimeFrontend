import { NavLink } from "react-router-dom";
import "../Styles/index.css";
import logo from "../images/Logo.jpeg";

function Navbar({ token, handleLogout }) {
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
                            to="/AddMovies"
                            className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}
                        >
                            AddMovies
                        </NavLink>

                        {/* Add Logout button if token exists */}
                        <button
                            className="nav-link logout-btn"
                            onClick={handleLogout}  // Call handleLogout function on click to remove token
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
