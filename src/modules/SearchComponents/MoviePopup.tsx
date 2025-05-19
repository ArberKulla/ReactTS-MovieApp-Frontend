import React from "react";
import { useNavigate } from "react-router-dom";

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
  const fallbackImage = "/fallback.jpg"; // Place this in your /public folder
  const imageSrc = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w500/${movie.backdrop_path}`
    : fallbackImage;

  const overview = movie.overview?.trim()
    ? movie.overview
    : "No description available for this movie.";

  const handleWatchNow = () => {
    navigate(`/watch/${type}/${movie.id}`);
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
          alt={movie.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Middle - Title and Overview */}
      <div className="px-4 py-2 flex-1">
        <h3 className="text-lg font-semibold line-clamp-2">{movie.title}</h3>
        <p className="text-sm mt-1 text-gray-300 line-clamp-4">{overview}</p>
      </div>

      {/* Bottom - Button */}
      <div className="px-4 pb-4">
        <button
          onClick={handleWatchNow}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded cursor-pointer"
        >
          Watch Now
        </button>
      </div>
    </div>
  );
};

export default MoviePopup;
