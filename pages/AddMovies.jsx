import React, { useContext, useState } from "react";
import axios from "axios";
import "../Styles/Add.css"
import { AuthContext } from "../src/context/AuthContext";

const AddMoviePage = () => {
    const { token } = useContext(AuthContext);
    console.log("token passed to moviedetail", token)
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        releaseDate: "",
        language: "",
        genre: "",
        imdbRating: "",
        googleRating: "",
        poster: "",
        trailer: "",
        suggestedToAll: true,
    });

    const [popupMessage, setPopupMessage] = useState("");
    const [popupVisible, setPopupVisible] = useState(false);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/movies/add`,
                { ...formData, language: formData.language.split(","), genre: formData.genre.split(",") },
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
                googleRating: "",
                poster: "",
                trailer: "",
                suggestedToAll: true,
            });
        } catch (error) {
            showPopup(error.response?.data?.message || "Failed to add movie. Try again.");
        }
    };

    return (
        <div className="add-movie-page">
            <h1>Add a Movie</h1>
            {popupVisible && <div className="popup">{popupMessage}</div>}
            <form onSubmit={handleSubmit} className="movie-form">
                <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Title" required />
                <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required />
                <input type="date" name="releaseDate" value={formData.releaseDate} onChange={handleChange} required />
                <input type="text" name="language" value={formData.language} onChange={handleChange} placeholder="Languages (comma-separated)" required />
                <input type="text" name="genre" value={formData.genre} onChange={handleChange} placeholder="Genres (comma-separated)" required />
                <input type="number" name="imdbRating" value={formData.imdbRating} onChange={handleChange} placeholder="IMDB Rating (0-10)" min="0" max="10" />
                <input type="number" name="googleRating" value={formData.googleRating} onChange={handleChange} placeholder="Google Rating (0-10)" min="0" max="10" />
                <input type="url" name="poster" value={formData.poster} onChange={handleChange} placeholder="Poster URL" required />
                <input type="url" name="trailer" value={formData.trailer} onChange={handleChange} placeholder="Trailer URL" required />
                <label>
                    <input type="checkbox" name="suggestedToAll" checked={formData.suggestedToAll} onChange={handleChange} />
                    Suggest to All Users
                </label>
                <button type="submit">Add Movie</button>
            </form>
        </div>
    );
};

export default AddMoviePage;
