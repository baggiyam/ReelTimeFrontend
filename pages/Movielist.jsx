import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../src/context/AuthContext";
import "../Styles/movielist.css";
import SuggestMoviePopup from "../Components/SuggestMoviePopup";

const MovieList = ({ friendId }) => {
  const { token, role } = useContext(AuthContext);
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [showSuggestPopupForMovie, setShowSuggestPopupForMovie] = useState(null);
  // State to track which movie is selected for suggestion

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

  const handleDelete = async (movieId) => {
    try {
      // Display confirmation message
      const isConfirmed = window.confirm("Are you sure you want to delete this movie?");
      if (!isConfirmed) return;

      // Make DELETE request to backend
      const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/movies/${movieId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Check if deletion was successful
      if (response.status === 200) {
        alert("Movie deleted successfully!");
        window.location.reload()

      }
    } catch (error) {
      console.error("Error deleting movie:", error);
      alert("Failed to delete the movie. Please try again.");
    }

  };

  const movieLanguages = Array.from(new Set(movies.flatMap(movie => movie.language || [])));
  const movieGenres = Array.from(new Set(movies.flatMap(movie => movie.genre || [])));

  const languages = ["All", ...new Set([...movieLanguages])];
  const genres = ["All", ...new Set([...movieGenres])];

  const handleFilterChange = () => {
    let filtered = movies;

    // Filter by language and genre
    if (selectedLanguage !== "All") {
      filtered = filtered.filter(movie => movie.language.includes(selectedLanguage));
    }
    if (selectedGenre !== "All") {
      filtered = filtered.filter(movie => movie.genre.includes(selectedGenre));
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(movie => movie.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    setFilteredMovies(filtered);
  };

  useEffect(() => {
    handleFilterChange();
  }, [selectedLanguage, selectedGenre, searchQuery]);

  return (
    <div className="movie-list-page">
      <h1>Movies</h1>
      {popupVisible && <div className="popup">{popupMessage}</div>}

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for a movie..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

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
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
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

                  {/* Suggest Movie Button */}
                  <button
                    onClick={() => setShowSuggestPopupForMovie(movie._id)}
                    className="suggest-btn">
                    Suggest to Friend
                  </button>

                  {role === "admin" && (
                    <>
                      <button
                        onClick={() => navigate(`/edit/${movie._id}`)}
                        className="edit-btn"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(movie._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded ml-2 hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Conditionally render SuggestMoviePopup for the selected movie */}
              {showSuggestPopupForMovie === movie._id && (
                <SuggestMoviePopup
                  movieId={movie._id}
                  onClose={() => setShowSuggestPopupForMovie(null)} // Close the popup by setting to null
                />
              )}
            </div>
          ))
        ) : (
          <div className="no-movies">
            No movies available. Didn’t find what you’re looking for?{" "}
            <button onClick={() => navigate("/addmovie")} className="add-movie-link">
              Click here to add the movie
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieList;
