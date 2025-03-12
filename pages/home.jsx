import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import "../Styles/Home.css";
import axios from 'axios';

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/movies/`)
            .then((response) => {
                const movieData = response.data;
                const sortedMovies = movieData.slice(-5).reverse();
                setMovies(sortedMovies);
            })
            .catch((error) => {
                console.log("Error fetching movies: ", error);
            });
    }, []);

    useEffect(() => {
        if (movies.length > 0) {
            const interval = setInterval(() => {
                setIndex(prevIndex => (prevIndex + 1) % movies.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [movies]);

    return (
        <div className="Homepage">
            <div
                className="hero-banner"
                style={{ backgroundImage: `url(${movies[index]?.poster})` }}>
                <div className="hero-content">
                    <h1>{movies[index]?.title || "Loading..."}</h1>
                    <p>{movies[index]?.description || "Discover the latest movies."}</p>
                    {movies.length > 0 && (
                        <a href={`/movies/${movies[index]._id}`} className="watch-now-btn">
                            View Details
                        </a>
                    )}
                </div>
            </div>

            <section className="movie-list-section Homepage">
                <h2>Latest Movies</h2>
                <div className="movie-list">
                    {movies.length > 0 ? (
                        movies.map(movie => (
                            <div key={movie._id} className="movie-card">
                                <img src={movie.poster} alt={movie.title} className="movie-poster" />
                                <div className="movie-card-info">
                                    <h3>{movie.title}</h3>
                                    <p>{movie.genre}</p>
                                    <p>{movie.language}</p>
                                    <Link to={`/movies/${movie._id}`} className="view-details-btn">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Loading movies...</p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
