import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../hooks/dispatch";
import { fetchMovies } from "../../data/moviesSlice";
import { fetchShows } from "../../data/showsSlice";
import { searchWithQuery } from "../../data/searchQuery";
import type { FunctionComponent } from "react";
import type { RootState } from "../../data/store";
import { TMDB } from "../../configs/tmdb";
import MoviesSlider from "../../modules/MovieSlider/MovieSlider";
import HeroSlider from "./HeroSlider";
import SearchBar from "./SearchBar";
import { useNavigate } from "react-router-dom";
import { FilterOutlined } from "@ant-design/icons";

const Homepage: FunctionComponent = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { movies } = useSelector((state: RootState) => state.movies);
  const { shows } = useSelector((state: RootState) => state.shows);
  const { searchResults } = useSelector(
    (state: RootState) => state.searchQuery
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchModalOpen, setSearchModalOpen] = useState(false);

  const MOVIEAPIURL = TMDB.trendingMovies;
  const SHOWAPIURL = TMDB.trendingShows;

  useEffect(() => {
    dispatch(fetchMovies(MOVIEAPIURL));
    dispatch(fetchShows(SHOWAPIURL));
  }, [dispatch]);

  useEffect(() => {
    if (searchQuery.length < 3) return;
    dispatch(searchWithQuery(TMDB.getSearchMoviesAndShows(searchQuery)));
  }, [searchQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleResultClick = (result: any) => {
    if (result.media_type === "tv") {
      navigate(`/watch/tv/${result.id}`);
    } else if (result.media_type === "movie") {
      navigate(`/watch/movie/${result.id}`);
    }
    setSearchModalOpen(false);
  };

  return (
    <div className="space-y-10 pt-6">
      {/* Search Bar */}
      <div className="w-full px-4 sm:px-6">
        <div className="max-w-screen-xl mx-auto flex justify-between items-center">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onFocus={() => setSearchModalOpen(true)}
            readOnly
          />
          <FilterOutlined
            style={{
              fontSize: "24px",
              color: "white",
              cursor: "pointer",
              marginLeft: 12,
            }}
            onClick={() => {
              // Add your filter logic here or open a filter modal
              console.log("Filter icon clicked");
            }}
          />
        </div>
      </div>

      {/* Hero Slider */}
      <HeroSlider
        movies={[...(movies?.results || []), ...(shows?.results || [])].slice(
          0,
          5
        )}
      />

      {/* Trending Movies and Shows */}
      <div className="pl-8">
        <MoviesSlider
          movies={movies?.results || []}
          title="Trending Movies"
          type="movie"
        />
        <MoviesSlider
          movies={shows?.results || []}
          title="Trending Shows"
          type="tv"
        />
      </div>

      {/* Search Modal */}
      {isSearchModalOpen && (
        <>
          <div
            className="fixed inset-0 w-screen h-screen bg-black/40 backdrop-blur-sm z-40"
            onClick={() => setSearchModalOpen(false)}
          />
          <div className="fixed top-1/2 left-1/2 z-50 w-full max-w-xl px-4 transform -translate-x-1/2 -translate-y-1/2">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-white text-xl font-bold">Search</h2>
              <FilterOutlined
                className="text-white cursor-pointer"
                style={{ fontSize: 24 }}
                onClick={() => {
                  // Add your filter logic or modal here
                  console.log("Filter icon clicked");
                }}
              />
            </div>
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            {searchResults.length > 0 && (
              <div className="mt-4 max-h-[400px] overflow-y-auto rounded-lg bg-[#111] p-4 space-y-4">
                {searchResults.map((result: any) => (
                  <div
                    key={result.id}
                    className="flex items-center gap-4 p-2 rounded-md hover:bg-[#222] cursor-pointer"
                    onClick={() => handleResultClick(result)}
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w92${result.poster_path}`}
                      alt={result.title || result.name}
                      className="w-[60px] h-[90px] object-cover rounded"
                    />
                    <div className="text-white">
                      <h3 className="text-md font-semibold">
                        {result.title || result.name}
                      </h3>
                      <p className="text-sm text-gray-400 flex items-center gap-2">
                        <span>⭐ {result.vote_average?.toFixed(1)}</span>
                        <span>{result.media_type?.toUpperCase() || "N/A"}</span>
                        <span>
                          {result.release_date?.slice(0, 4) ||
                            result.first_air_date?.slice(0, 4)}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Homepage;
