import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../src/context/AuthContext";
import "../Styles/movielist.css";

const WatchlistPage = () => {
  const { token } = useContext(AuthContext);
  const [watchlist, setWatchlist] = useState([]);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/movies/watchlist`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWatchlist(response.data.data);
      } catch (error) {
        setPopupMessage("Failed to load watchlist");
        setPopupVisible(true);
      }
    };
    fetchWatchlist();
  }, [token]);

  const showPopup = (message) => {
    setPopupMessage(message);
    setPopupVisible(true);
    setTimeout(() => setPopupVisible(false), 3000);
  };

  const handleRemove = async (movieId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/movies/watchlist/${movieId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWatchlist(watchlist.filter((movie) => movie._id !== movieId));
      showPopup("Movie removed from watchlist");
    } catch (error) {
      showPopup(error.response?.data?.message || "Failed to remove movie");
    }
  };

  const handleAddToWatched = async (movieId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/movies/add-to-watched/${movieId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/movies/watchlist/${movieId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setWatchlist(watchlist.filter((movie) => movie._id !== movieId));
      showPopup("Movie moved to watched");
    } catch (error) {
      showPopup(error.response?.data?.message || "Failed to move movie to watched");
    }
  };

  const handleAddToFavorites = async (movieId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/movies/add-to-favorites/${movieId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showPopup("Movie added to favorites");
    } catch (error) {
      showPopup(error.response?.data?.message || "Failed to add movie to favorites");
    }
  };

  return (
    <div className="movie-list-page">
      <h1>Your Watchlist</h1>
      {popupVisible && <div className="popup">{popupMessage}</div>}
      <div className="movie-list">
        {watchlist.length > 0 ? (
          watchlist.map((movie) => (
            <div key={movie._id} className="movie-card">
              <img src={movie.poster} alt={movie.title} />
              <div className="movie-info">
                <h3>{movie.title}</h3>
              </div>
              <div className="movie-actions">
                <button onClick={() => handleRemove(movie._id)} className="add-btn">
                  Remove
                </button>
                <button onClick={() => handleAddToWatched(movie._id)} className="add-btn">
                  Move to Watched
                </button>
                <button onClick={() => handleAddToFavorites(movie._id)} className="add-btn">
                  Add to Favorites
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No movies in your watchlist</p>
        )}
      </div>
    </div>
  );
};

export default WatchlistPage;
