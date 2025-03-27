import React, { useContext, useState } from "react";
import axios from "axios";
import "../Styles/Add.css";
import { AuthContext } from "../src/context/AuthContext";

const AddMoviePage = () => {
    const { token } = useContext(AuthContext);

    const [formData, setFormData] = useState({
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

    const [popupMessage, setPopupMessage] = useState("");
    const [popupVisible, setPopupVisible] = useState(false);
    const [isFetched, setIsFetched] = useState(false);
    const [fetchError, setFetchError] = useState(false);

    const showPopup = (message) => {
        setPopupMessage(message);
        setPopupVisible(true);
        setTimeout(() => setPopupVisible(false), 3000);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleEnterManually = () => {
        setIsFetched(true);
        showPopup("You can now enter movie details manually.");
    };

    // Fetch Movie Details from TMDB
    const handleFetchMovie = async () => {
        if (!formData.title) {
            showPopup("Please enter a movie title first.");
            return;
        }

        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/tmdb/movie/${formData.title}`);
            const movie = res.data;

            console.log("Fetched Movie Data:", movie);

            setFormData({
                ...formData,
                title: movie.title || "",
                description: movie.description || "",
                releaseDate: movie.releaseDate || "",
                language: movie.language.join(", "),
                genre: movie.genre.join(", "),
                imdbRating: movie.imdbRating || "",
                poster: movie.poster || "",
                trailer: movie.trailer || "",
                backdrop: movie.backdrop || "",

            });

            setIsFetched(true);
            setFetchError(false);
            showPopup("Movie details fetched! Review & submit.");
        } catch (error) {
            console.error("Error fetching movie:", error.response?.data || error.message);
            setFetchError(true);
            showPopup("Failed to fetch movie details. You can enter manually.");
        }
    };

    // Handle Fetch Again
    const handleFetchAgain = () => {
        setFormData({
            ...formData,
            description: "",
            releaseDate: "",
            language: "",
            genre: "",
            imdbRating: "",
            poster: "",
            trailer: "",
            backdrop: "",

        });
        setIsFetched(false);
        setFetchError(false);
    };

    // Submit Handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/movies/add`,
                {
                    ...formData,
                    language: formData.language.split(",").map((lang) => lang.trim()),
                    genre: formData.genre.split(",").map((gen) => gen.trim()),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            showPopup("Movie added successfully!");
            setFormData({
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
            setIsFetched(false);
            setFetchError(false);
        } catch (error) {
            showPopup(error.response?.data?.message || "Failed to add movie. Try again.");
        }
    };

    return (
        <div className="add-movie-page">
            <h1>Add a Movie</h1>
            {popupVisible && <div className="popup">{popupMessage}</div>}

            <form className="movie-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter Movie Title"
                    required
                />

                {!isFetched && (
                    <>
                        <button type="button" className="fetch-btn" onClick={handleFetchMovie}>
                            Fetch Movie Details
                        </button>

                        {fetchError && (
                            <button type="button" className="manual-btn" onClick={handleEnterManually}>
                                Enter Details Manually
                            </button>
                        )}
                    </>
                )}

                {isFetched && (
                    <>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Description"
                            required
                        />
                        <input
                            type="date"
                            name="releaseDate"
                            value={formData.releaseDate}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="language"
                            value={formData.language}
                            onChange={handleChange}
                            placeholder="Languages (comma-separated)"
                            required
                        />
                        <input
                            type="text"
                            name="genre"
                            value={formData.genre}
                            onChange={handleChange}
                            placeholder="Genres (comma-separated)"
                            required
                        />
                        <input
                            type="number"
                            name="imdbRating"
                            value={formData.imdbRating}
                            onChange={handleChange}
                            placeholder="IMDB Rating (0-10)"
                            min="0"
                            max="10"
                            step="0.1"
                        />
                        <input
                            type="url"
                            name="poster"
                            value={formData.poster}
                            onChange={handleChange}
                            placeholder="Poster URL"
                            required
                        />
                        <input
                            type="url"
                            name="trailer"
                            value={formData.trailer}
                            onChange={handleChange}
                            placeholder="Trailer URL"
                            required
                        />
                        <input
                            type="url"
                            name="backdrop"
                            value={formData.backdrop}
                            onChange={handleChange}
                            placeholder="Backdrop URL"
                        />
                        <button type="submit">Check & Submit Movie</button>
                        <button type="button" className="fetch-again-btn" onClick={handleFetchAgain}>
                            Fetch Again
                        </button>
                    </>
                )}
            </form>
        </div>
    );
};

export default AddMoviePage;
