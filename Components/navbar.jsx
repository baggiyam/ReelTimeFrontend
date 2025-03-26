import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import React, { useContext } from "react";
import "../Styles/index.css";
import logo from "../images/Logo.jpeg";
import { AuthContext } from "../src/context/AuthContext";
import { slide as Menu } from 'react-burger-menu';

function Navbar() {
    const navigate = useNavigate();
    const { token, logout, username } = useContext(AuthContext);
    const [open, setOpen] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const fileInputRef = useRef(null);


    useEffect(() => {
        const savedImage = localStorage.getItem('profileImage');
        if (savedImage) {
            setProfileImage(savedImage);
        }
    }, []);

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
        logout();
        closeMenu();
        navigate("/", { state: { message: "Successfully logged out" } });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
                // Save to localStorage
                localStorage.setItem('profileImage', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
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
                {token && username && (
                    <div className="profile-section">
                        <div className="profile-pic-container" onClick={triggerFileInput}>
                            {profileImage ? (
                                <img src={profileImage} alt="Profile" className="profile-pic" />
                            ) : (
                                <div className="profile-placeholder">Upload Profile Pic</div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                style={{ display: "none" }}
                                onChange={handleImageChange}
                            />
                        </div>
                        <div className="welcome-message">
                            Welcome, {username}!
                        </div>
                    </div>
                )}

                <div className="nav-links">
                    <NavLink to="/" className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}>Home</NavLink>

                    {!token ? (
                        <>
                            <NavLink to="/login" className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}>Login</NavLink>
                            <NavLink to="/signup" className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}>Signup</NavLink>
                        </>
                    ) : (
                        <>
                            <NavLink to="/movielist" className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}>MovieList</NavLink>
                            <NavLink to="/watchlist" className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}>Watchlist</NavLink>
                            <NavLink to="/favorites" className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}>Favorites</NavLink>
                            <NavLink to="/watched" className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}>Watched</NavLink>
                            <NavLink to="/addmovie" className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}>AddMovies</NavLink>
                            <NavLink to="/friend-requests" className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}>Friend Request</NavLink>
                            <NavLink to="/suggested" className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}>Suggested Movies</NavLink>

                            <button className="nav-link logout-btn" onClick={handleLogout}>Logout</button>


                        </>
                    )}
                </div>
            </Menu>
        </div>
    );
}

export default Navbar;
