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
import HeroSlider from "../../modules/Home/HeroSlider";
import SearchBar from "../../modules/Home/SearchBar";
import { useNavigate } from "react-router-dom";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import LoginModal from "../../modules/Authenticate/Login";
import SignupModal from "../../modules/Authenticate/SignUp";
import { useAuth } from "../../contexts/AuthContext";

const Homepage: FunctionComponent = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { movies } = useSelector((state: RootState) => state.movies);
  const { shows } = useSelector((state: RootState) => state.shows);
  const { searchResults } = useSelector((state: RootState) => state.searchQuery);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchModalOpen, setSearchModalOpen] = useState(false);
  const [authModalState, setAuthModalState] = useState<"login" | "signup" | null>(null);
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);

  const { token, userName, role, logout } = useAuth();

  const MOVIEAPIURL = TMDB.trendingMovies;
  const SHOWAPIURL = TMDB.trendingShows;

  useEffect(() => {
    dispatch(fetchMovies(MOVIEAPIURL));
    dispatch(fetchShows(SHOWAPIURL));
  }, [dispatch]);

  useEffect(() => {
    if (searchQuery.length < 1) return;
    dispatch(searchWithQuery(TMDB.getSearchMoviesAndShows(searchQuery)));
  }, [searchQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchModalOpen(false);
        setAuthModalState(null);
        setUserMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        !target.closest("#user-menu") &&
        !target.closest("#user-menu-toggle")
      ) {
        setUserMenuOpen(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
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
    <div className="space-y-10 pt-6 relative">
      {/* Search Bar */}
      <div className="w-full px-4 sm:px-6">
        <div className="max-w-screen-xl mx-auto flex justify-between items-center">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onFocus={() => setSearchModalOpen(true)}
            readOnly
          />

          {token && userName ? (
            <div className="relative">
              <button
                id="user-menu-toggle"
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 text-white cursor-pointer"
                type="button"
              >
                <UserOutlined style={{ fontSize: 24 }} />
                <span>{userName}</span>
              </button>

              {isUserMenuOpen && (
                <div
                  id="user-menu"
                  className="absolute right-0 mt-2 w-32 bg-gray-900 rounded shadow-lg z-50"
                >
                  {role === "ROLE_ADMIN" && (
                    <button
                      onClick={() => {
                        navigate("/admin");
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-blue-400 hover:bg-blue-600 hover:text-white rounded-md font-semibold"
                      type="button"
                    >
                      Admin Page
                    </button>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                      setAuthModalState("login");
                    }}
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-600 hover:text-white rounded-md font-semibold"
                    type="button"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <LogoutOutlined
              style={{
                fontSize: "24px",
                color: "white",
                cursor: "pointer",
                marginLeft: 12,
              }}
              onClick={() => setAuthModalState("login")}
            />
          )}
        </div>
      </div>

      {/* Hero Slider */}
      <HeroSlider
        movies={[...(movies?.results || []), ...(shows?.results || [])].slice(0, 5)}
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

      {/* Auth Modal */}
      {authModalState === "login" && (
        <LoginModal
          onClose={() => setAuthModalState(null)}
          onSwitchToSignup={() => setAuthModalState("signup")}
        />
      )}
      {authModalState === "signup" && (
        <SignupModal
          onClose={() => setAuthModalState(null)}
          onSwitchToLogin={() => setAuthModalState("login")}
        />
      )}
    </div>
  );
};

export default Homepage;
