import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../src/context/AuthContext";
import "../Styles/movielist.css";

const MovieList = () => {
  const { token, role } = useContext(AuthContext);
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [selectedGenre, setSelectedGenre] = useState("All");

  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/movies`)
      .then(response => {
        setMovies(response.data);
        setFilteredMovies(response.data);
      })
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

  const defaultLanguages = ["English", "Tamil", "Hindi", "Malayalam", "Korean"];
  const defaultGenres = ["Action", "Comedy", "Drama", "Horror", "Thriller"];

  const movieLanguages = Array.from(new Set(movies.flatMap(movie => movie.language || [])));
  const movieGenres = Array.from(new Set(movies.flatMap(movie => movie.genre || [])));

  const languages = ["All", ...new Set([...defaultLanguages, ...movieLanguages])];
  const genres = ["All", ...new Set([...defaultGenres, ...movieGenres])];

  const handleFilterChange = () => {
    let filtered = movies;
    if (selectedLanguage !== "All") {
      filtered = filtered.filter(movie => movie.language.includes(selectedLanguage));
    }
    if (selectedGenre !== "All") {
      filtered = filtered.filter(movie => movie.genre.includes(selectedGenre));
    }
    setFilteredMovies(filtered);
  };

  useEffect(() => {
    handleFilterChange();
  }, [selectedLanguage, selectedGenre]);

  return (
    <div className="movie-list-page">
      <h1>Movies</h1>
      {popupVisible && <div className="popup">{popupMessage}</div>}

      <div className="filter-container">
        <label htmlFor="language-filter">Language: </label>
        <select id="language-filter" value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}>
          {languages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
        </select>

        <label htmlFor="genre-filter">Genre: </label>
        <select id="genre-filter" value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
          {genres.map(genre => <option key={genre} value={genre}>{genre}</option>)}
        </select>
      </div>

      <div className="movie-list">
        {filteredMovies.length > 0 ? filteredMovies.map((movie) => (
          <div key={movie._id} className="movie-card">
            <img src={movie.poster} alt={movie.title} />
            <div className="movie-info">
              <h3>{movie.title}</h3>
              <p><strong>Language:</strong> {movie.language.join(", ")}</p>
              <p><strong>Genre:</strong> {movie.genre.join(", ")}</p>
              <div className="button-group">
                <button onClick={() => handleAddToList(movie._id, "watchlist")} className="add-btn">Add To Watchlist</button>
                <button onClick={() => handleAddToList(movie._id, "favorites")} className="add-btn">Add to Favorite</button>
                <button onClick={() => navigate(`/movie/${movie._id}`)} className="view-details-btn">View Details</button>
                {role === "admin" && (
                  <button onClick={() => navigate(`/edit/${movie._id}`)} className="edit-btn">Edit</button>
                )}
              </div>
            </div>
          </div>
        )) : <p className="no-movies">No movies available</p>}
      </div>
    </div>
  );
};

export default MovieList;
