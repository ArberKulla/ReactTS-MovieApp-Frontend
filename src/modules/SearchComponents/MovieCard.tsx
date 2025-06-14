import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface MovieCardProps {
  movie: any;
  onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave: () => void;
  type?: string;
}

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onMouseEnter,
  onMouseLeave,
  type
}) => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const handleClick = () => {
    navigate(`/watch/${type}/${movie.id}`);
  };

  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
    : "/fallback.jpg"; // fallback for broken path

  return (
    <div
      key={movie.id}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={handleClick}
      className="relative min-w-[150px] max-w-[150px] transition duration-200 transform hover:scale-105 mr-3 cursor-pointer"
    >
      <img
        src={isLoaded ? imageUrl : "/fallback.jpg"}
        alt={movie.title}
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsLoaded(true)} // prevent infinite fallback loop if broken
        className="h-[220px] w-full object-cover rounded-lg"
      />
      <div className="text-yellow-400 text-sm font-semibold absolute top-2 right-2 bg-zinc-900 px-1 py-1 leading-none pointer-events-none z-10 rounded-md">
        <span>★ </span>
        <span className="text-white">{movie.vote_average?.toFixed(1)}</span>
      </div>
    </div>
  );
};

export default MovieCard;
