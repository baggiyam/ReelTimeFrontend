import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../src/context/AuthContext";
import "../Styles/Add.css";

const EditMovie = () => {
    const { token } = useContext(AuthContext);
    const { id } = useParams();
    const navigate = useNavigate();

    const [movie, setMovie] = useState({
        title: "",
        description: "",
        releaseDate: "",
        language: "",
        genre: "",
        imdbRating: "",
        poster: "",
        trailer: "",
        backdrop: "",
    
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMovie = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/movies/${id}`);
                if (response.data) {
                    setMovie({
                        ...response.data,
                        releaseDate: response.data.releaseDate ? response.data.releaseDate.split("T")[0] : "",
                    });
                    setLoading(false);
                }
            } catch (err) {
                setError("Failed to load movie details");
                setLoading(false);
            }
        };

        fetchMovie();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setMovie((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/movies/${id}`,
                movie,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            navigate("/movielist");
        } catch (err) {
            setError("Failed to update movie");
            console.error(err); // Log error for debugging
        }
    };

    return (
        <div className="add-movie-page">
            <h2>Edit Movie</h2>
            {error && <p className="error-message">{error}</p>}
            {loading ? (
                <p>Loading movie details...</p>
            ) : (
                <form onSubmit={handleSubmit} className="movie-form">
                    <fieldset disabled={loading}>
                        <label>Title:
                            <input type="text" name="title" value={movie.title} onChange={handleChange} required />
                        </label>

                        <label>Description:
                            <textarea name="description" value={movie.description} onChange={handleChange} required />
                        </label>

                        <label>Release Date:
                            <input type="date" name="releaseDate" value={movie.releaseDate} onChange={handleChange} required />
                        </label>

                        <label>Language:
                            <input type="text" name="language" value={movie.language} onChange={handleChange} required />
                        </label>

                        <label>Genre:
                            <input type="text" name="genre" value={movie.genre} onChange={handleChange} required />
                        </label>

                        <label>IMDB Rating:
                            <input type="number" name="imdbRating" value={movie.imdbRating} onChange={handleChange} step="0.1" required />
                        </label>

                        <label>Poster URL:
                            <input type="text" name="poster" value={movie.poster} onChange={handleChange} required />
                        </label>

                        <label>Trailer URL:
                            <input type="text" name="trailer" value={movie.trailer} onChange={handleChange} required />
                        </label>

                        <label>Backdrop URL:
                            <input type="text" name="backdrop" value={movie.backdrop} onChange={handleChange} required />
                        </label>

                        <button type="submit">Update Movie</button>
                    </fieldset>
                </form>
            )}
        </div>
    );
};

export default EditMovie;
