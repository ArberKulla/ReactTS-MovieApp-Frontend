import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../hooks/dispatch";
import { fetchMovies } from "../../data/moviesSlice";
import { fetchShows } from "../../data/showsSlice";
import {searchWithQuery} from "../../data/searchQuery";
import type { FunctionComponent } from "react";
import type { RootState } from "../../data/store";
import { TMDB } from "../../configs/tmdb";
import MoviesSlider from "../../modules/MovieSlider/MovieSlider";
import HeroSlider from "./HeroSlider";

const Homepage: FunctionComponent = () => {
  const dispatch = useAppDispatch();
  const { movies } = useSelector((state: RootState) => state.movies);
  const { shows } = useSelector((state: RootState) => state.shows);
  const { searchResults } = useSelector((state: RootState) => state.searchQuery);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchModalOpen, setSearchModalOpen] = useState(false);

  const MOVIEAPIURL = TMDB.trendingMovies;
  const SHOWAPIURL = TMDB.trendingShows;

  useEffect(() => {
    dispatch(fetchMovies(MOVIEAPIURL));
    dispatch(fetchShows(SHOWAPIURL));
  }, [dispatch]);

  useEffect(() => {
    if (searchQuery.length < 3) {
      return;
    }
    dispatch(searchWithQuery(TMDB.getSearchMoviesAndShows(searchQuery)));
  }, [searchQuery]);

  // Mbyll modalin me Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    console.log(searchResults),
    <div className="space-y-10 pt-6">
      {/* Search Bar */}
      <div className="w-full px-4 sm:px-6">
        <div className="max-w-screen-xl mx-auto flex justify-center">
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              placeholder="Search..."
              onFocus={() => setSearchModalOpen(true)}
              readOnly
              className="w-full py-2 pl-10 pr-4 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm cursor-pointer"
            />
            <svg
              className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Hero Slider */}
      <HeroSlider movies={[...(movies?.results || []), ...(shows?.results || [])].slice(0, 5)} />

      {/* Trending Movies */}
      <div className="pl-8">
      <MoviesSlider movies={movies?.results || []}  title="Trending Movies" type="movie"/>

      {/* Trending Shows */}
      <MoviesSlider movies={shows?.results || []}  title="Trending Shows" type="tv"/>
      </div>

      {/* Modal for Search */}
      {isSearchModalOpen && (
        <>
          {/* Overlay i plotë */}
          <div
            className="fixed inset-0 w-screen h-screen bg-black/40 backdrop-blur-sm z-40"
            onClick={() => setSearchModalOpen(false)}
          />

          {/* Vetëm Search Bar i qendërzuar */}
          <div className="fixed top-1/2 left-1/2 z-50 w-full max-w-xl px-4 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <input
                type="text"
                autoFocus
                placeholder="What do you wanna Watch?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-3 pl-10 pr-4 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <svg
                className="absolute left-3 top-3.5 h-4 w-4 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                />
              </svg>
            </div>
          </div>
        </>
      )}

      {/* Kur modalja nuk hapet, trego butonin / ndonjë mënyrë për ta hapur */}
      {!isSearchModalOpen && (
        <div className="w-full px-4 sm:px-6">
          <div className="max-w-screen-xl mx-auto flex justify-start">
            <div className="relative w-full max-w-sm">
              <input
                type="text"
                placeholder="Search..."
                onFocus={() => setSearchModalOpen(true)}
                readOnly
                className="w-full py-2 pl-10 pr-4 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm cursor-pointer"
              />
              <svg
                className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Homepage;
