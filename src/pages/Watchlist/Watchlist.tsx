import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom"; // <-- Import useNavigate
import MovieCard from "../../modules/SearchComponents/MovieCard";
import MoviePopup from "../../modules/SearchComponents/MoviePopup";
import { TMDB } from "../../configs/tmdb"; 

const POPUP_WIDTH = 256;
const POPUP_HEIGHT = 320;
const GAP = 4;

const WatchlistPage: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate(); // <-- Initialize navigate

  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [hoveredMovie, setHoveredMovie] = useState<any | null>(null);
  const [popupPos, setPopupPos] = useState<{ top: number; left: number } | null>(null);
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [isPopupHovered, setIsPopupHovered] = useState(false);
    const BACKENDURL = TMDB.BACKEND_BASE
  

  useEffect(() => {
    if (!token) {
      navigate("/"); // <-- Redirect to homepage if not authenticated
      return;
    }

    const fetchWatchlist = async () => {
      try {
        const res = await axios.get(BACKENDURL+"watchlists/get", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const transformed = (res.data.content || []).map(transformMovieItem);
        setWatchlist(transformed);
      } catch (err) {
        console.error(err);
      }
    };

    fetchWatchlist();
  }, [token, navigate]);

  function transformMovieItem(item: any) {
    return {
      originalId: item.id,
      id: item.movieId,
      title: item.title,
      overview: item.description,
      vote_average: item.rating,
      poster_path: item.posterUrl,
      backdrop_path: item.backdropUrl,
      type: item.type,
      release_date: item.releaseYear,
    };
  }

  const handleRemove = async (id: number) => {
    if (!token) return;

    try {
      await axios.delete(`http://localhost:8080/api/watchlists/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setWatchlist((prev) => prev.filter((item) => item.originalId !== id));
      toast.success("Movie removed from watchlist!");
    } catch (error) {
      console.error("Failed to remove watchlist item:", error);
      toast.error("Failed to remove item. Please try again.");
    }
  };

  const handleCardMouseEnter = (movie: any, e: React.MouseEvent<HTMLDivElement>) => {
    setHoveredMovie(movie);
    setIsCardHovered(true);

    const cardRect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let left = cardRect.right + GAP;
    let top = cardRect.top - 25;

    if (cardRect.right + POPUP_WIDTH + GAP > viewportWidth) {
      if (cardRect.left - POPUP_WIDTH - GAP > 0) {
        left = cardRect.left - POPUP_WIDTH - GAP;
      } else {
        left = cardRect.left;
      }
    }

    if (top + POPUP_HEIGHT > viewportHeight) {
      top = viewportHeight - 1.3 * POPUP_HEIGHT - GAP;
    }

    setPopupPos({ top: top + window.scrollY, left: left + window.scrollX });
  };

  const handleCardMouseLeave = () => setIsCardHovered(false);
  const handlePopupMouseEnter = () => setIsPopupHovered(true);
  const handlePopupMouseLeave = () => setIsPopupHovered(false);

  return (
    <div className="px-4 max-w-screen-xl mx-auto pt-8" id="scroll-container">
      <h1 className="text-4xl font-bold text-white mb-10 ml-1">Watchlist</h1>

      {watchlist.length === 0 ? (
        <p className="text-gray-400">Your watchlist is empty.</p>
      ) : (
        <div className="flex flex-wrap gap-4 justify-center">
          {watchlist.map((item: any) => (
            <div key={item.originalId} className="flex flex-col items-center w-[150px] ml-3">
              <MovieCard
                movie={item}
                type={item.type || "movie"}
                onMouseEnter={(e) => handleCardMouseEnter(item, e)}
                onMouseLeave={handleCardMouseLeave}
              />
              <div className="mt-1 text-sm text-white w-full px-1 flex justify-between">
                <span className="text-zinc-400 capitalize truncate">{item.type || "movie"}</span>
                <span className="text-zinc-500 truncate">
                  {item.release_date?.slice(0, 4) || item.first_air_date?.slice(0, 4) || "—"}
                </span>
              </div>
              <div className="text-white text-sm font-semibold px-1 truncate w-full">
                {item.title || item.name}
              </div>

              <button
                className="mt-3 w-full bg-red-600 hover:bg-red-700 transition-colors duration-200 text-white font-semibold py-2 rounded shadow-md text-center"
                onClick={() => handleRemove(item.originalId)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {(isCardHovered || isPopupHovered) && hoveredMovie && popupPos && (
        <MoviePopup
          movie={hoveredMovie}
          top={popupPos.top}
          left={popupPos.left}
          onMouseEnter={handlePopupMouseEnter}
          onMouseLeave={handlePopupMouseLeave}
          type={hoveredMovie.type || "movie"}
        />
      )}
    </div>
  );
};

export default WatchlistPage;
