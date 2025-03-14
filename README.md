# Reeltime

Reeltime is a full-stack MERN (MongoDB, Express.js, React.js, Node.js) movie application that allows users to explore movies, add them to watchlists, favorites, and watched lists, and watch trailers.

## Features

- **User Authentication**: Sign up, log in, and token-based authentication.
- **Movie Management**: Users can add movies, and those marked as `suggestedToAll` will appear in the public movie list.
- **Watchlist & Favorites**: Users can add movies to their personal watchlist, favorites, and watched lists.
- **Movie Trailers**: Each movie entry can include a trailer.
- **Admin Features**: Only admins can edit movie details.
- **Responsive UI**: Fully styled and optimized for different screen sizes.

## Tech Stack

### Frontend
- React.js
- React Router
- Context API (AuthContext)
- CSS for styling

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication

## Installation

### Prerequisites
- Node.js installed
- MongoDB running locally or using a cloud database

### Steps to Run Locally

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/reeltime.git
   cd reeltime
   ```

2. **Install dependencies:**
   ```sh
   npm install
   cd client
   npm install
   ```

3. **Set up environment variables:**
   - Create a `.env` file in the root directory and add:
     ```env
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_secret_key
     ```

4. **Run the backend server:**
   ```sh
   npm run server
   ```

5. **Run the frontend:**
   ```sh
   cd client
   npm start
   ```

6. **Open the app in your browser:**
   ```
   http://localhost:3000
   ```

## API Routes

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Log in and get a JWT token

### Movies
- `GET /api/movies` - Get all movies
- `POST /api/movies` - Add a new movie (Admin only)
- `PUT /api/movies/:id` - Edit movie details (Admin only)

### Watchlist & Favorites
- `POST /api/watchlist` - Add movie to watchlist
- `POST /api/favorites` - Add movie to favorites

## Future Enhancements
- Movie ratings and reviews
- Social features like sharing watchlists
- Enhanced UI with animations

## License
This project is licensed under the MIT License.

## Contact
For any issues, feel free to create an issue or contact gowribaggiyam@gmail.com

