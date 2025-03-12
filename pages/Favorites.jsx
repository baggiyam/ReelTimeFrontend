import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/Favorites.css";

const FavoritesPage = ({ token }) => {
  const [favorites, setFavorites] = useState([]);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/movies/favorites`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => setFavorites(response.data))
      .catch(() => showPopup("Failed to load favorites."));
  }, [token]);

  const showPopup = (message) => {
    setPopupMessage(message);
    setPopupVisible(true);
    setTimeout(() => setPopupVisible(false), 3000);
  };

  const removeFromFavorites = (movieId) => {
    axios.delete(`${import.meta.env.VITE_API_BASE_URL}/movies/favorites/${movieId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        setFavorites(favorites.filter(movie => movie._id !== movieId));
        showPopup("Removed from Favorites!");
      })
      .catch(() => showPopup("Action failed. Try again."));
  };

  return (
    <div className="favorites-page">
      <h1>My Favorites</h1>
      {popupVisible && <div className="popup">{popupMessage}</div>}
      <div className="movie-list">
        {favorites.length > 0 ? favorites.map((movie) => (
          <div key={movie._id} className="movie-card">
            <img src={movie.poster} alt={movie.title} />
            <div className="movie-info">
              <h3>{movie.title}</h3>
              <button onClick={() => removeFromFavorites(movie._id)}>Remove</button>
            </div>
          </div>
        )) : <p>No favorite movies yet.</p>}
      </div>
    </div>
  );
};

export default FavoritesPage;
