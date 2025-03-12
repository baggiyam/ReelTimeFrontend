import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Importing pages
import Home from '../pages/home';
import Login from '../pages/login';
import Signup from '../pages/signup';
import AddMoviePage from '../pages/AddMovies';
import MovieListPage from '../pages/Movielist';
import FavoritesPage from '../pages/Favorites';
import WatchlistPage from "../pages/WatchList";
import WatchedPage from "../pages/watched"
import Navbar from '../Components/navbar';
import Footer from '../Components/Footer';

const App = () => {

  const [token, setToken] = useState(null);

  // UseEffect to load token from localStorage on page load
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken'); // Consistent key for token
    if (storedToken) {
      setToken(storedToken); // Set token in state
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Remove token correctly from localStorage
    setToken(null); // Reset token state
  };

  return (
    <Router>
      <Navbar token={token} handleLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/movielist" element={<MovieListPage token={token} />} />
        <Route path="/watchlist" element={<WatchlistPage token={token} />} />
        <Route path="/favorites" element={<FavoritesPage token={token} />} />
        <Route path="/watched" element={<WatchedPage token={token} />} />
        <Route path="/addmovie" element={<AddMoviePage />} />
      </Routes>
      <Footer />
    </Router>
  );
};
export default App;
