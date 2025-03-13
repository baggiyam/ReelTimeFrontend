import React, { useState, useEffect, useContext } from 'react';
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
import MovieDetailsPage from "../pages/Moviedetail";
import { AuthContext } from './context/AuthContext';
import ProtectedRoute from './context/ProtectedRoute';
const App = () => {

  const { token, logout } = useContext(AuthContext)

  return (
    <Router>
      <Navbar />
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/movielist" element={<MovieListPage />} />
        <Route path="/watchlist" element={<ProtectedRoute><WatchlistPage /></ProtectedRoute>} />
        <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
        <Route path="/watched" element={<ProtectedRoute><WatchedPage /></ProtectedRoute>} />
        <Route path="/addmovie" element={<ProtectedRoute><AddMoviePage /></ProtectedRoute>} />
        <Route path="/movie/:id" element={<MovieDetailsPage />} />
      </Routes>
      <Footer />
    </Router>
  );
};
export default App;
