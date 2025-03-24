import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../Styles/moviedetail.css"; // Fixed import

export default function MovieDetails() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/movies/${id}`)
            .then((response) => {
                setMovie(response.data);
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to load movie details");
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="movie-container">
            {/* Trailer Section */}
            <div className="banner">
                {movie.trailer ? (
                    movie.trailer.includes("youtube.com") || movie.trailer.includes("vimeo.com") ? (
                        <iframe
                            className="trailer"
                            src={movie.trailer.replace("watch?v=", "embed/")}
                            title="Movie Trailer"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    ) : (
                        <img className="trailer-image" src={movie.trailer} alt="Movie Banner" />
                    )
                ) : (
                    <div className="no-trailer">No Trailer Available</div>
                )}
            </div>

            {/* Movie Details Section */}
            <div className="movie-info">
                <h1 className="title">{movie.title}</h1>
                <p className="release-date">{movie.releaseDate}</p>

                <div className="tags">
                    <span className="tag genre">{movie.genre}</span>
                    <span className="tag language">{movie.language}</span>
                </div>

                <p className="description">{movie.description}</p>

                <div className="ratings">
                    <p>IMDB Rating: ⭐ {movie.imdbRating}</p>
                    {movie.googleRating && <p>Google Rating: ⭐ {movie.googleRating}</p>}
                </div>
            </div>
        </div>
    );
}
