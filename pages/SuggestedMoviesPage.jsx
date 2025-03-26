import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../src/context/AuthContext";
import "../Styles/suggestedMovies.css";

const SuggestedMoviesPage = () => {
    const { token } = useContext(AuthContext);
    const [suggestedMovies, setSuggestedMovies] = useState([]);
    const [popupMessage, setPopupMessage] = useState("");
    const [popupVisible, setPopupVisible] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/movies/suggested`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setSuggestedMovies(response.data);
            })
            .catch(() => setPopupMessage("Failed to load suggested movies."));
    }, [token]);

    const showPopup = (message) => {
        setPopupMessage(message);
        setPopupVisible(true);
        setTimeout(() => setPopupVisible(false), 3000);
    };

    const handleAddToList = async (movieId, type) => {
        try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/movies/add-to-${type}/${movieId}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
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
                headers: { Authorization: `Bearer ${token}` },
            });

            // Check if deletion was successful
            if (response.status === 200) {
                alert("Movie deleted successfully!");
                // Optionally, refresh the page or update the state dynamically
            }
        } catch (error) {
            console.error("Error deleting movie:", error);
            alert("Failed to delete the movie. Please try again.");
        }
    };

    return (
        <div className="movie-list-container">
            <h1>Suggested Movies</h1>
            {popupVisible && <div className="popup">{popupMessage}</div>}

            <div className="movie-list">
                {suggestedMovies.length > 0 ? (
                    suggestedMovies.map((movie) => (
                        <div key={movie.movie._id} className="movie-card">
                            <img src={movie.movie.poster} alt={movie.movie.title} />
                            <div className="movie-info">
                                <h3>{movie.movie.title}</h3>
                                <p>
                                    <strong>Language:</strong> {movie.movie.language.join(", ")}
                                </p>
                                <p>
                                    <strong>Genre:</strong> {movie.movie.genre.join(", ")}
                                </p>
                                <p>
                                    <strong>Suggested by:</strong> {movie.sender.username}
                                </p>
                                <div className="button-group">
                                    <button
                                        onClick={() => handleAddToList(movie.movie._id, "watchlist")}
                                        className="add-btn"
                                    >
                                        Add To Watchlist
                                    </button>
                                    <button
                                        onClick={() => handleAddToList(movie.movie._id, "favorites")}
                                        className="add-btn"
                                    >
                                        Add to Favorite
                                    </button>
                                    <button
                                        onClick={() => navigate(`/movie/${movie.movie._id}`)}
                                        className="view-details-btn"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-movies">
                        No suggested movies. Didn’t find what you’re looking for?{" "}
                        <button onClick={() => navigate("/addmovie")} className="add-movie-link">
                            Click here to add the movie
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SuggestedMoviesPage;
