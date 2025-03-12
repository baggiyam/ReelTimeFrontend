import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/WatchList.css";

const WatchlistPage = ({ token }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/movies/watchlist`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => setWatchlist(response.data))
      .catch(() => showPopup("Failed to load watchlist."));
  }, [token]);

  const showPopup = (message) => {
    setPopupMessage(message);
    setPopupVisible(true);
    setTimeout(() => setPopupVisible(false), 3000);
  };

  const removeFromWatchlist = (movieId) => {
    axios.delete(`${import.meta.env.VITE_API_BASE_URL}/movies/watchlist/${movieId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        setWatchlist(watchlist.filter(movie => movie._id !== movieId));
        showPopup("Removed from Watchlist!");
      })
      .catch(() => showPopup("Action failed. Try again."));
  };

  return (
    <div className="watchlist-page">
      <h1>My Watchlist</h1>
      {popupVisible && <div className="popup">{popupMessage}</div>}
      <div className="movie-list">
        {watchlist.length > 0 ? watchlist.map((movie) => (
          <div key={movie._id} className="movie-card">
            <img src={movie.poster} alt={movie.title} />
            <div className="movie-info">
              <h3>{movie.title}</h3>
              <button onClick={() => removeFromWatchlist(movie._id)}>Remove</button>
            </div>
          </div>
        )) : <p>No movies in your watchlist.</p>}
      </div>
    </div>
  );
};

export default WatchlistPage;
