import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../Styles/moviedetail"
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
            .catch((err) => {
                setError("Failed to load movie details");
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div className="text-center text-xl">Loading...</div>;
    if (error) return <div className="text-red-500 text-center">{error}</div>;

    return (
        <div className="max-w-5xl mx-auto p-4">
            {/* Banner Section with Trailer */}
            <div className="relative w-full h-64 md:h-96 bg-black">
                {movie.trailer ? (
                    <iframe
                        className="w-full h-full"
                        src={movie.trailer.replace("watch?v=", "embed/")}
                        title="Movie Trailer"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                ) : (
                    <div className="flex items-center justify-center h-full text-white">
                        No Trailer Available
                    </div>
                )}
            </div>

            {/* Movie Details */}
            <div className="p-6 bg-white shadow-lg rounded-lg mt-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{movie.title}</h1>
                <p className="text-gray-600 italic">{movie.releaseDate}</p>

                <div className="flex flex-wrap gap-2 mt-4">
                    <span className="bg-gray-200 px-3 py-1 rounded-full text-sm font-medium">{movie.genre}</span>
                    <span className="bg-blue-200 px-3 py-1 rounded-full text-sm font-medium">{movie.language}</span>
                </div>

                <p className="mt-4 text-gray-700 leading-relaxed">{movie.description}</p>

                <div className="mt-6 flex items-center gap-6">
                    <p className="text-lg font-semibold">IMDB Rating: ⭐ {movie.imdbRating}</p>
                    {movie.googleRating && <p className="text-lg font-semibold">Google Rating: ⭐ {movie.googleRating}</p>}
                </div>
            </div>
        </div>
    );
}