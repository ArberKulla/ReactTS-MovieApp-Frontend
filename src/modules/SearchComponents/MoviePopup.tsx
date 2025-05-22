import React from "react";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "antd";
import { HeartFilled } from "@ant-design/icons";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast"; // <-- Import toast

interface MoviePopupProps {
  movie: any;
  top?: number;
  left?: number;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  type?: string;
}

const MoviePopup: React.FC<MoviePopupProps> = ({
  movie,
  top,
  left,
  onMouseEnter,
  onMouseLeave,
  type,
}) => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const fallbackImage = "/fallback.jpg";
  const imageSrc = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w500/${movie.backdrop_path}`
    : fallbackImage;

  const overview = movie.overview?.trim()
    ? movie.overview
    : "No description available for this movie.";

  const handleWatchNow = () => {
    navigate(`/watch/${type}/${movie.id}`);
  };

const handleAddToWatchlist = async () => {
  if (!token) {
    toast.error("You must be logged in to add to your watchlist.");
    return;
  }

  const payload = {
    movieId: movie.id.toString(),
    title: movie.title ? movie.title : movie.name,
    description: movie.overview?.slice(0, 500) || "",
    rating: parseFloat(movie.vote_average?.toFixed(1) || "0"),
    type: type,
    releaseYear: movie.release_date?.slice(0, 4) || movie.first_air_date?.slice(0, 4) || "—", 
    posterUrl: movie.poster_path ? `${movie.poster_path}` : "",
    backdropUrl: movie.backdrop_path ? `${movie.backdrop_path}` : "",
  };


  try {
    const response = await axios.post(
      "http://localhost:8080/api/watchlists/watchlist",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    toast.success("Movie added to watchlist!");
    console.log("Added to watchlist:", response.data);
  } catch (error: any) {
    if (
      error.response?.status === 409 ||
      error.response?.data?.includes("already")
    ) {
      toast.error("Movie is already in your watchlist.");
    } else {
      toast.error("Failed to add movie. Please try again.");
    }
    console.error("Failed to add to watchlist:", error);
  }
};


  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="fixed w-64 min-h-[256px] bg-zinc-800/95 text-white rounded-lg shadow-lg z-[9999] overflow-hidden flex flex-col"
      style={{
        top,
        left,
        pointerEvents: "auto",
        cursor: "default",
      }}
    >
      {/* Top - Image */}
      <div className="w-full aspect-video">
        <img
          src={imageSrc}
          alt={movie.title ? movie.title : movie.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Middle - Title and Overview */}
      <div className="px-4 py-2 flex-1">
        <h3 className="text-lg font-semibold line-clamp-2">{movie.title ? movie.title : movie.name}</h3>
        <p className="text-sm mt-1 text-gray-300 line-clamp-4">{overview}</p>
      </div>

      {/* Bottom - Buttons */}
      <div className="px-4 pb-4 flex items-center gap-2">
        <button
          onClick={handleWatchNow}
          className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded cursor-pointer"
        >
          Watch Now
        </button>

        <Tooltip
          title="Add to Watchlist"
          getPopupContainer={(trigger) => trigger.parentElement!}
        >
          <button
            onClick={handleAddToWatchlist}
            className="w-9 h-9 flex items-center justify-center rounded-full border-2 border-white hover:border-white bg-transparent hover:bg-white/10 text-red-600"
          >
            <HeartFilled />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default MoviePopup;
