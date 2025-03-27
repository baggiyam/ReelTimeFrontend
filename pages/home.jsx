import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../Styles/Home.css";
import axios from 'axios';

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [index, setIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/movies/`)
            .then((response) => {
                const movieData = response.data;
                const sortedMovies = movieData.slice(-10).reverse();
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
        <div className="Homepage ">
            <div
                className="hero-banner "
                style={{ backgroundImage: `url(${movies[index]?.backdrop})` }}>
                <div className="hero-content">
                    <h1>{movies[index]?.title || "Loading..."}</h1>
                    <p>{movies[index]?.description || "Discover the latest movies."}</p>
                    {movies.length > 0 && (
                        <Link to={`/movie/${movies[index]._id}`} className="watch-now-btn">
                            View Details
                        </Link>
                    )}
                </div>
            </div>
            < section className="app-features ">
                <div className="intro-text">
                    <h1>Welcome to Reeltime</h1>
                    <p>Your personal movie management platform. Discover, organize, and share your favorite movies with friends.</p>
                </div>
                <div className="feature">
                    <h3>Manage Your Movies</h3>
                    <p>Organize your watchlist, favorites, and watched movies effortlessly.</p>
                </div>
                <div className="feature">
                    <h3>Connect with Friends</h3>
                    <p>Share movie suggestions to your friends by adding them to your friendlist.</p>
                </div>

            </section>

            <section className="movie-list-section Homepage">
                <h2>Latest Movies</h2>
                <div className="movie-list">
                    {movies.length > 0 ? (
                        movies.map(movie => (
                            <div key={movie._id} className="movie-card">
                                <img src={movie.poster} alt={movie.title} className="movie-poster" />
                                <div className="movie-card-info">
                                    <h3>{movie.title}</h3>
                                    < label>Language: <p>{movie.language}</p> </label>
                                    <lable>genre: <p>{movie.genre}</p></lable>
                                    <Link to={`/movie/${movie._id}`} className="view-details-btn">
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


            <button onClick={() => navigate("/movielist")} className="watch-more-btn">
                Watch More
            </button>
        </div>
    );
};

export default Home;
