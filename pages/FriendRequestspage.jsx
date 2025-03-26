import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../src/context/AuthContext";
import "../Styles/FriendRequestsPage.css";

const FriendRequestPage = () => {
    const { token } = useContext(AuthContext);
    const [receiver, setReceiver] = useState("");
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState(null);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [friendList, setFriendList] = useState([]);

    useEffect(() => {
        fetchPendingRequests();
        fetchFriendList();
    }, []);

    const fetchPendingRequests = async () => {
        try {
            const response = await axios.get("http://localhost:5002/api/friends/pending", {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("Pending Requests:", response.data); // Debug log
            setPendingRequests(response.data);
        } catch (err) {
            console.error("Error fetching pending requests:", err.response?.data || err.message);
        }
    };

    const fetchFriendList = async () => {
        try {
            const response = await axios.get("http://localhost:5002/api/friends/friendlist", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFriendList(response.data);
        } catch (err) {
            console.error("Error fetching friend list:", err);
        }
    };

    const handleInputChange = (e) => setReceiver(e.target.value);

    const handleFindUser = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`http://localhost:5002/api/auth/search/${receiver}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(response.data.user);
            setMessage("");
            setError(null);
        } catch (err) {
            setUser(null);
            setError(err.response ? err.response.data.message : "Server error.");
            setMessage("");
        }
    };

    const handleSendRequest = async () => {
        if (!user) {
            setError("No user found to send the friend request.");
            return;
        }
        try {
            const response = await axios.post(
                "http://localhost:5002/api/friends/send",
                { receiver: user.username },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage(response.data.message);
            setError(null);
            setUser(null);
            fetchPendingRequests();
        } catch (err) {
            setError(err.response ? err.response.data.message : "Server error.");
            setMessage("");
        }
    };

    const handleAcceptRequest = async (requestId) => {
        try {
            const response = await axios.post(
                `http://localhost:5002/api/friends/accept/${requestId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Remove the accepted request from the pending requests
            setPendingRequests((prev) => prev.filter((req) => req._id !== requestId));
            fetchFriendList(); // Update the friend list

            setMessage("Friend request accepted!");
            setError(null);

        } catch (err) {
            console.error("Error accepting friend request:", err.response?.data?.message || err.message);
            setError(err.response?.data?.message || "An error occurred while accepting the request.");
            setMessage("");  // Clear any success message in case of error
        }
    };

    const handleRejectRequest = async (requestId) => {
        try {
            const response = await axios.post(
                `http://localhost:5002/api/friends/reject/${requestId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setPendingRequests((prev) => prev.filter((req) => req._id !== requestId));
        } catch (err) {
            console.error("Error rejecting friend request:", err.response?.data?.message || err.message);
        }
    };

    return (
        <div className="friend-request-page">
            {/* Send Friend Request Section */}
            <div className="section">
                <h2>Send a Friend Request</h2>
                <div className="input-container">
                    <input
                        type="text"
                        value={receiver}
                        onChange={handleInputChange}
                        placeholder="Enter Username or Email"
                        className="input-field"
                    />
                    <button className="find-user-btn" onClick={handleFindUser}>Find User</button>
                </div>
                {message && <p className="success-message">{message}</p>}
                {error && <p className="error-message">{error}</p>}
                {user && (
                    <div className="user-details">
                        <h3>{user.username}</h3>
                        <p>Email: {user.email}</p>
                        {user.profilePicture && <img src={user.profilePicture} alt="Profile" className="profile-pic" />}
                        <button className="send-request-btn" onClick={handleSendRequest}>Send Friend Request</button>
                    </div>
                )}
            </div>

            {/* Pending Friend Requests Section */}
            <div className="section">
                <h2>Pending Friend Requests</h2>
                {pendingRequests.length === 0 ? (
                    <p>No pending requests.</p>
                ) : (
                    <ul className="request-list">
                        {pendingRequests.map((request) => (
                            <li key={request._id} className="request-item">
                                <span>{request.sender.username}</span>
                                <button className="accept-btn" onClick={() => handleAcceptRequest(request._id)}>Accept</button>
                                <button className="reject-btn" onClick={() => handleRejectRequest(request._id)}>Reject</button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Friend List Section */}
            <div className="section">
                <h2>Your Friends</h2>
                {friendList.length === 0 ? (
                    <p>You have no friends yet.</p>
                ) : (
                    <ul className="friend-list">
                        {friendList.map((friend) => (
                            <li key={friend._id} className="friend-item">{friend.username}</li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default FriendRequestPage;
