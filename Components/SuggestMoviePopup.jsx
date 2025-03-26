import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../src/context/AuthContext";

const SuggestMoviePopup = ({ movieId, friendId }) => {
    const { token } = useContext(AuthContext);
    const [friends, setFriends] = useState([]);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const closePopup = () => {
        setShowPopup(false);
    };


    // Fetch list of friends from the backend
    const fetchFriends = async () => {
        if (!token) {
            setError("No valid token found.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/friends/friendlist`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("Friends fetched:", response.data); // Debugging log
            setFriends(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching friends:", err);
            setError("Failed to fetch friends");
            setLoading(false);
        }
    };

    // Handle friend selection (checkboxes)
    const handleFriendSelection = (e) => {
        const { value, checked } = e.target;
        setSelectedFriends((prevSelected) =>
            checked
                ? [...prevSelected, value]
                : prevSelected.filter((friendId) => friendId !== value)
        );
    };

    // Handle submit for movie suggestion using the multiple-friend route
    const handleSubmit = async () => {
        if (selectedFriends.length === 0) {
            alert("Please select at least one friend to suggest the movie.");
            return;
        }

        console.log("Selected friends:", selectedFriends); // Debugging log

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/movies/suggest/${movieId}`,
                { friends: selectedFriends }, // Ensure this matches backend expectations
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("Response from backend:", response.data);  // Debug response
            alert("Movie suggestion sent successfully to selected friends!");

        } catch (err) {
            console.error("Error suggesting movie:", err.response ? err.response.data : err.message);
            alert("There was an error sending your movie suggestion. Please try again.");
        }
    };

    useEffect(() => {
        fetchFriends();
    }, [token]);

    // Reset friend selection on popup close
    const handleCancel = () => {
        setSelectedFriends([]);  // Reset selection
        if (typeof closePopup === "function") {
            closePopup();  // Close only if valid
        } else {
            console.warn("closePopup is not defined or is not a function");
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h3>Suggest this movie to your friends</h3>
                {loading ? (
                    <p>Loading friends...</p>
                ) : error ? (
                    <p style={{ color: "red" }}>{error}</p>
                ) : (
                    <div>
                        <label>Select friends to suggest to:</label>
                        <div className="friend-list">
                            {friends.length === 0 ? (
                                <p>No friends to suggest this movie to. Add friends to proceed.</p>
                            ) : (
                                friends.map((friend) => (
                                    <div key={friend._id} className="friend-item">
                                        <input
                                            type="checkbox"
                                            value={friend._id}
                                            onChange={handleFriendSelection}
                                        />
                                        <label>{friend.username}</label>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
                <div className="popup-actions">
                    <button onClick={handleSubmit} disabled={loading}>
                        Send Suggestion
                    </button>
                    <button onClick={handleCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default SuggestMoviePopup;
