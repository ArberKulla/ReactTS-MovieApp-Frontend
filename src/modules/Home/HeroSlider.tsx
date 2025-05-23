import { useState, useEffect } from "react";
import axios from "axios";
import { HeartFilled } from "@ant-design/icons";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { TMDB } from "../../configs/tmdb"; 


type Movie = {
  id: number;
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  overview?: string;
  poster_path?: string;
  backdrop_path?: string;
  media_type?: "movie" | "tv"; // Optional, in case your data includes this
};

const IMAGE_BASE = "https://image.tmdb.org/t/p/original";

const useWindowWidth = () => {
  const [width, setWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 0);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return width;
};

const HeroSlider = ({ movies }: { movies: Movie[] }) => {
  const [current, setCurrent] = useState(0);
  const windowWidth = useWindowWidth();
  const { token } = useAuth();
  const navigate = useNavigate(); // ✅ Initialize navigate

  useEffect(() => {
    setCurrent(0);
  }, [movies]);

  useEffect(() => {
    if (movies.length === 0) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % movies.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [movies]);

  if (!movies.length) return <div>Loading movies...</div>;

  const movie = movies[current];
  if (!movie) return null;

  const title = movie.title || movie.name || "Untitled";
  const date = movie.release_date || movie.first_air_date || "";
  const rating = movie.vote_average?.toFixed(1) ?? "N/A";
  const poster = `${IMAGE_BASE}${movie.poster_path}?v=${current}`;
  const backdrop = `${IMAGE_BASE}${movie.backdrop_path}`;
  const POSTER_WIDTH = 360;
  const MIN_SPACE_REQUIRED = 1024;
  const showPoster = windowWidth >= MIN_SPACE_REQUIRED;
  const BACKENDURL = TMDB.BACKEND_BASE

  // ✅ Determine movie type
  const type = movie.media_type || (movie.title ? "movie" : "tv");

  // ✅ Watch Now handler
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
      title: movie.title || movie.name || "Untitled",
      description: movie.overview?.slice(0, 500) || "",
      rating: parseFloat(movie.vote_average?.toFixed(1) || "0"),
      type: movie.media_type,
      releaseYear: movie.release_date?.slice(0, 4) || movie.first_air_date?.slice(0, 4) || "—",
      posterUrl: movie.poster_path || "",
      backdropUrl: movie.backdrop_path || "",
    };

    try {
      const response = await axios.post(
        BACKENDURL+"watchlists/watchlist",
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
    <div className="relative w-full h-[60vh] text-white px-4 md:px-8">
      <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-lg">
        <div
          key={backdrop}
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 blur-sm brightness-[.4]"
          style={{ backgroundImage: `url(${backdrop})` }}
        />

        <div className="relative z-10 flex items-center justify-between h-full max-w-7xl mx-auto px-6">
          <div className="max-w-xl space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-200">
              <span>{type.toUpperCase()}</span>
              <span>
                {new Date(date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <span>⭐ {rating}</span>
            </div>
            <p className="text-sm md:text-base text-gray-300 line-clamp-3">
              {movie.overview}
            </p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={handleWatchNow} // ✅ Added handler here
                className="flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 text-white font-medium hover:bg-white/20 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 fill-white"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch Now
              </button>
              <button
                onClick={handleAddToWatchlist}
                className="w-10 h-10 rounded-full flex items-center justify-center border border-white/30 text-red-600 hover:bg-white/20 transition"
              >
                <HeartFilled />
              </button>
            </div>
          </div>

          {showPoster && movie.poster_path && (
            <div
              className="ml-8 shadow-xl transform rotate-10"
              style={{ width: `${POSTER_WIDTH}px`, flexShrink: 0 }}
            >
              <img
                src={poster}
                alt={title}
                className="rounded-lg"
                style={{ width: `${POSTER_WIDTH}px`, height: "auto" }}
              />
            </div>
          )}
        </div>

        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {movies.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-3 h-3 rounded-full transition ${
                idx === current ? "bg-white" : "bg-gray-500"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;
