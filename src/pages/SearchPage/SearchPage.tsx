import React, { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../hooks/dispatch";
import { createSearchParams } from "react-router-dom";
import { last, throttle } from "lodash";
import MovieCard from "../../modules/SearchComponents/MovieCard";
import MoviePopup from "../../modules/SearchComponents/MoviePopup";
import { fetchMovies } from "../../data/moviesSlice";
import { fetchShows } from "../../data/showsSlice";
import type { RootState } from "../../data/store";
import { TMDB } from "../../configs/tmdb";

const POPUP_WIDTH = 256;
const POPUP_HEIGHT = 320;
const GAP = 4;

const SearchPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const [type, setType] = useState<"movie" | "tv">("movie");
  const [page, setPage] = useState(1);
  const [lastScrollY, setLastScrollY] = useState(0);

  const [hoveredMovie, setHoveredMovie] = useState<any | null>(null);
  const [popupPos, setPopupPos] = useState<{ top: number; left: number } | null>(null);
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [isPopupHovered, setIsPopupHovered] = useState(false);

  const movies = useSelector((state: RootState) => state.movies.movies);
  const shows = useSelector((state: RootState) => state.shows.shows);
  const fetchStatusMovies = useSelector((state: RootState) => state.movies.fetchStatus);
  const fetchStatusShows = useSelector((state: RootState) => state.shows.fetchStatus);

  const getContent = useCallback(() => {
    const url =
      type === "movie"
        ? searchQuery !== ""
          ? `${TMDB.getSearchMovies(searchQuery)}&page=${page}`
          : `${TMDB.discoverMovies}&page=${page}`
        : searchQuery !== ""
        ? `${TMDB.getSearchShows(searchQuery)}&page=${page}`
        : `${TMDB.discoverShows}&page=${page}`;

    if (type === "movie") {
      dispatch(fetchMovies(url));
    } else {
      dispatch(fetchShows(url));
    }
  }, [dispatch, page, searchQuery, type]);

  useEffect(() => {
    getContent();
  }, [getContent]);

  const throttleScrollHandler = useRef(
    throttle(() => {
      setPage((prev) => prev + 1);
    }, 1000)
  );

useEffect(() => {
  const scrollContainer = document.getElementById("scroll-container");
  if (!scrollContainer) return;

  const scrollHandler = () => {
    const scrollTop = scrollContainer.scrollTop;
    const scrollHeight = scrollContainer.scrollHeight;
    const clientHeight = scrollContainer.clientHeight;

    const isScrollingDown = scrollTop > lastScrollY;
    setLastScrollY(scrollTop);

    const nearBottom = scrollTop + clientHeight >= scrollHeight - 100;
    const status = type === "movie" ? fetchStatusMovies : fetchStatusShows;

    if (nearBottom && status !== "loading" && isScrollingDown) {
      throttleScrollHandler.current();
    }
  };

  scrollContainer.addEventListener("scroll", scrollHandler);
  return () => scrollContainer.removeEventListener("scroll", scrollHandler);
}, [lastScrollY, fetchStatusMovies, fetchStatusShows, type]);


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setSearchParams(createSearchParams({ search: newQuery }));
    setPage(1);
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

  const results = type === "movie" ? movies?.results : shows?.results;

  return (
<div className="px-4 max-w-screen-xl mx-auto pt-8">
  <h1 className="text-4xl font-bold text-white mb-10 ml-1">Search</h1>

  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
    <input
      type="text"
      value={searchQuery}
      onChange={handleSearchChange}
      placeholder="Search for movies or shows..."
      className="w-full py-2 px-4 rounded-md bg-zinc-800 text-white border border-zinc-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
    />

<div className="relative w-full sm:w-auto">
  <select
    value={type}
    onChange={(e) => {
      setType(e.target.value as "movie" | "tv");
      setPage(1);
    }}
    className="appearance-none w-30 py-2 px-4 pr-10 rounded-md bg-zinc-800 text-white border border-zinc-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
  >
    <option value="movie">Movies</option>
    <option value="tv">TV Shows</option>
     </select>
      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-300">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
    <button
      className="py-2 px-4 rounded-md bg-zinc-700 text-white border border-zinc-600 hover:bg-zinc-600 transition w-full sm:w-auto"
      onClick={() => {
        // Filter functionality can go here in the future
      }}
    >
      Filter
    </button>
  </div>

    {(type === "movie" ? movies?.total_results : shows?.total_results) !== undefined && (
    <p className="text-sm text-gray-400 mb-8 ">
      Found {(type === "movie" ? movies?.total_results : shows?.total_results)?.toLocaleString()} results
    </p>
  )}

<div className="flex flex-wrap gap-4 justify-center">
  {results?.map((item: any) => (
    <div key={item.id} className="flex flex-col items-start w-[150px] ml-3">
      <MovieCard
        movie={item}
        type={type}
        onMouseEnter={(e) => handleCardMouseEnter(item, e)}
        onMouseLeave={handleCardMouseLeave}
      />
      <div className="mt-1 text-sm text-white w-full px-1 flex justify-between">
        <span className="text-zinc-400 capitalize truncate">{type}</span>
        <span className="text-zinc-500 truncate">
          {item.release_date?.slice(0, 4) || item.first_air_date?.slice(0, 4) || "—"}
        </span>
      </div>
      <div className="text-white text-sm font-semibold px-1 truncate w-full">
        {item.title || item.name}
      </div>
    </div>
  ))}
</div>



  {(isCardHovered || isPopupHovered) && hoveredMovie && popupPos && (
    <MoviePopup
      movie={hoveredMovie}
      top={popupPos.top}
      left={popupPos.left}
      onMouseEnter={handlePopupMouseEnter}
      onMouseLeave={handlePopupMouseLeave}
      type={type}
    />
  )}
</div>

  );
};

export default SearchPage;