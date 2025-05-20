import React, { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../hooks/dispatch";
import { createSearchParams } from "react-router-dom";
import { throttle } from "lodash";
import MovieCard from "../../modules/SearchComponents/MovieCard";
import MoviePopup from "../../modules/SearchComponents/MoviePopup";
import { fetchMovies } from "../../data/moviesSlice";
import { fetchShows } from "../../data/showsSlice";
import type { RootState } from "../../data/store";
import { TMDB } from "../../configs/tmdb";
import { FilterOutlined } from "@ant-design/icons";

const POPUP_WIDTH = 256;
const POPUP_HEIGHT = 320;
const GAP = 4;

const genreOptions = [
  { id: "", name: "All Genres" },
  { id: "28", name: "Action" },
  { id: "12", name: "Adventure" },
  { id: "16", name: "Animation" },
  { id: "35", name: "Comedy" },
  { id: "80", name: "Crime" },
  { id: "99", name: "Documentary" },
  { id: "18", name: "Drama" },
  { id: "10751", name: "Family" },
  { id: "14", name: "Fantasy" },
  { id: "36", name: "History" },
  { id: "27", name: "Horror" },
  { id: "10402", name: "Music" },
  { id: "9648", name: "Mystery" },
  { id: "10749", name: "Romance" },
  { id: "878", name: "Science Fiction" },
  { id: "10770", name: "TV Movie" },
  { id: "53", name: "Thriller" },
  { id: "10752", name: "War" },
  { id: "37", name: "Western" }
];

const yearOptions = Array.from({ length: 2025 - 1800 }, (_, i) => (2025 - i).toString());

const ShowSearchPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const [type, setType] = useState<"movie" | "tv">("tv");
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
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    genre: "",
    year: "",
    sortBy: "popularity.desc"
  });


  const getContent = useCallback(() => {
    const queryParams = new URLSearchParams();
    queryParams.set("page", page.toString());
    queryParams.set("include_adult", "false");

    if (filters.genre) queryParams.set("with_genres", filters.genre);
    if (filters.year) queryParams.set("primary_release_year", filters.year);
    if (filters.sortBy) queryParams.set("sort_by", filters.sortBy);

    let url = "";

    if (searchQuery) {
      url =
        type === "movie"
          ? `${TMDB.getSearchMovies(searchQuery)}&page=${page}&${queryParams.toString()}`
          : `${TMDB.getSearchShows(searchQuery)}&page=${page}&${queryParams.toString()}`;
    } else {
      url =
        type === "movie"
          ? `${TMDB.getsearchDiscoverMovies("")}&${queryParams.toString()}`
          : `${TMDB.getsearchDiscoverShows("")}&${queryParams.toString()}`;
    }

    if (type === "movie") {
      dispatch(fetchMovies(url));
    } else {
      dispatch(fetchShows(url));
    }
  }, [dispatch, page, searchQuery, type, filters]);

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
  <div className="px-4 max-w-screen-xl mx-auto pt-8" id="scroll-container">
    <h1 className="text-4xl font-bold text-white mb-10 ml-1">Explore Shows</h1>

    <div className="mb-6">
      <div className="flex items-center gap-4 mb-3">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search for movies or shows..."
          className="w-full py-2 px-4 rounded-md bg-zinc-800 text-white border border-zinc-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        {/* <select
          value={type}
          onChange={(e) => {
            setType(e.target.value as "movie" | "tv");
            setPage(1);
          }}
          className="py-2 px-3 pr-10 rounded-md bg-zinc-900 text-white border border-zinc-700 focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none relative"
        >
          <option value="movie">Movies</option>
          <option value="tv">TV Shows</option>
        </select> */}

        <FilterOutlined
          style={{ fontSize: "24px", color: "white", cursor: "pointer" }}
          onClick={() => setShowFilters((prev) => !prev)}
        />
      </div>

      <div
        className={`grid grid-cols-1 sm:grid-cols-4 gap-4 transition-all duration-500 ease-in-out transform ${
          showFilters ? 'opacity-100 scale-100 max-h-[300px] mb-4' : 'opacity-0 scale-95 max-h-0 overflow-hidden'
        }`}
      >
        <div className="relative w-full">
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters((f) => ({ ...f, sortBy: e.target.value }))}
            className="w-full py-2 px-3 pr-10 rounded-md bg-zinc-900 text-white border border-zinc-700 appearance-none focus:ring-2 focus:ring-blue-500 max-h-[200px] overflow-y-auto"
          >
            <option value="popularity.desc">Popularity ↓</option>
            <option value="popularity.asc">Popularity ↑</option>
            <option value="release_date.desc">Release Date ↓</option>
            <option value="release_date.asc">Release Date ↑</option>
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▼</div>
        </div>

        <div className="relative w-full">
          <select
            value={filters.year}
            onChange={(e) => setFilters((f) => ({ ...f, year: e.target.value }))}
            className="w-full py-2 px-3 pr-10 rounded-md bg-zinc-900 text-white border border-zinc-700 appearance-none focus:ring-2 focus:ring-blue-500 max-h-[200px] overflow-y-auto"
          >
            <option value="">All Years</option>
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▼</div>
        </div>

        <div className="relative w-full">
          <select
            value={filters.genre}
            onChange={(e) => setFilters((f) => ({ ...f, genre: e.target.value }))}
            className="w-full py-2 px-3 pr-10 rounded-md bg-zinc-900 text-white border border-zinc-700 appearance-none focus:ring-2 focus:ring-blue-500 max-h-[200px] overflow-y-auto"
          >
            {genreOptions.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▼</div>
        </div>
      </div>
    </div>

    {(type === "movie" ? movies?.total_results : shows?.total_results) !== undefined && (
      <p className="text-sm text-gray-400 mb-6">
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

export default ShowSearchPage;