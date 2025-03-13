import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../src/context/AuthContext";
import "../Styles/Watchlist.css";

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

  return (
    <div className="watchlist-page">
      <h1>Your Watchlist</h1>
      {popupVisible && <div className="popup">{popupMessage}</div>}
      <div className="movie-list">
        {watchlist.length > 0 ? (
          watchlist.map((movie) => (
            <div key={movie._id} className="movie-card">
              <img src={movie.poster} alt={movie.title} />
              <h3>{movie.title}</h3>
              <button onClick={() => handleRemove(movie._id)}>Remove</button>
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
