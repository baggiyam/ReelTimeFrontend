import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Styles/MovieList.css";

const MovieList = ({ token }) => {
  const [movies, setMovies] = useState([]);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/movies`)
      .then(response => setMovies(response.data))
      .catch(() => setPopupMessage("Failed to load movies."));
  }, []);

  const showPopup = (message) => {
    setPopupMessage(message);
    setPopupVisible(true);
    setTimeout(() => setPopupVisible(false), 3000);
  };

  const handleAddToList = async (movieId, type) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/movies/add-to-${type}/${movieId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showPopup(`Movie added to ${type}`);
    } catch (error) {
      showPopup(error.response?.data?.message || "Action failed");
    }
  };

  return (
    <div className="movie-list-page">
      <h1>Movies</h1>
      {popupVisible && <div className="popup">{popupMessage}</div>}
      <div className="movie-list">
        {movies.length > 0 ? movies.map((movie) => (
          <div key={movie._id} className="movie-card">
            <img src={movie.poster} alt={movie.title} />
            <div className="movie-info">
              <h3>{movie.title}</h3>
              <button onClick={() => handleAddToList(movie._id, "watchlist")}>Add to Watchlist</button>
              <button onClick={() => handleAddToList(movie._id, "favorites")}>Add to Favorites</button>
              <button onClick={() => handleAddToList(movie._id, "watched")}>Mark as Watched</button>
            </div>
          </div>
        )) : <p>No movies available</p>}
      </div>
    </div>
  );
};

export default MovieList;
