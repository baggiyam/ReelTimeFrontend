import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "../Styles/watched.css";
import { AuthContext } from "../src/context/AuthContext";

const WatchedPage = () => {
    const { token } = useContext(AuthContext)
    const [watchedMovies, setWatchedMovies] = useState([]);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/movies/watched`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => setWatchedMovies(response.data))
            .catch(() => console.log("Failed to load watched movies."));
    }, [token]);

    return (
        <div className="watched-page">
            <h1>Watched Movies</h1>
            <div className="movie-list">
                {watchedMovies.length > 0 ? (
                    watchedMovies.map((movie) => (
                        <div key={movie._id} className="movie-card">
                            <img src={movie.poster} alt={movie.title} />
                            <div className="movie-info">
                                <h3>{movie.title}</h3>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No watched movies yet.</p>
                )}
            </div>
        </div>
    );
};

export default WatchedPage;
