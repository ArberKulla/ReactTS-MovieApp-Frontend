import type { FunctionComponent } from "react";
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  HomeOutlined,
  SearchOutlined,
  VideoCameraOutlined,
  DesktopOutlined,
  HeartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext"; // Adjust path as needed
import LoginModal from "../../modules/Authenticate/Login";
import SignupModal from "../../modules/Authenticate/SignUp";

const MainLayout: FunctionComponent = () => {
  const [isCompact, setIsCompact] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { token, userName, logout, role } = useAuth();

  const [authModalState, setAuthModalState] = useState<
    "login" | "signup" | null
  >(null);

  // Dropdown toggle for account options (Logout)
  const [showAccountOptions, setShowAccountOptions] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsCompact(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest("#account-dropdown")) {
        setShowAccountOptions(false);
      }
    };
    if (showAccountOptions) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showAccountOptions]);

  // Handler for WatchList click
  const handleWatchlistClick = (e: React.MouseEvent) => {
    if (!token) {
      e.preventDefault();
      setAuthModalState("login");
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#000]">
      {/* Top Navigation Bar for Mobile */}
      <div className="sm:hidden fixed top-0 left-0 right-0 bg-[#121212] z-50 flex justify-around py-3 border-b border-zinc-800">
        <Link
          to="/"
          className="flex flex-col items-center text-white text-[15px]"
        >
          <HomeOutlined className="text-[18px]" style={{ color: "white" }} />
          <span className="text-xs text-white">All</span>
        </Link>
        <Link
          to="/explore/movies"
          className="flex flex-col items-center text-white text-[15px]"
        >
          <VideoCameraOutlined
            className="text-[18px]"
            style={{ color: "white" }}
          />
          <span className="text-xs text-white">Movies</span>
        </Link>
        <Link
          to="/explore/tv"
          className="flex flex-col items-center text-white text-[15px]"
        >
          <DesktopOutlined className="text-[18px]" style={{ color: "white" }} />
          <span className="text-xs text-white">TV</span>
        </Link>
        <Link
          to="/watchlist"
          onClick={(e) => {
            if (!token) {
              e.preventDefault();
              setAuthModalState("login");
            }
          }}
          className="flex flex-col items-center text-white text-[15px]"
        >
          <HeartOutlined className="text-[18px]" style={{ color: "white" }} />
          <span className="text-xs text-white">WatchList</span>
        </Link>
      </div>

      {/* Sidebar for Desktop */}
      <aside
        className={`hidden sm:flex ${
          isCompact ? "w-16" : "w-56"
        } h-full flex-col rounded-r-xl`}
      >
        <nav className="flex flex-col h-full pl-2 text-white space-y-4">
          {/* Top Section */}
          <div className="bg-[#181818] rounded-xl py-5 px-2 space-y-2">
            <Link
              to="/"
              className="flex items-center gap-3 px-3 py-2 text-[15px] font-semibold text-white rounded hover:bg-white/10 transition"
            >
              <HomeOutlined
                className="text-[18px]"
                style={{ color: "white" }}
              />
              {!isCompact && <span className="text-white">Home</span>}
            </Link>
            <Link
              to="/search"
              className="flex items-center gap-3 px-3 py-2 text-[15px] font-semibold text-white rounded hover:bg-white/10 transition"
            >
              <SearchOutlined
                className="text-[18px]"
                style={{ color: "white" }}
              />
              {!isCompact && <span className="text-white">Search</span>}
            </Link>
          </div>

          {/* Main Section */}
          <div className="flex flex-col justify-between flex-grow bg-[#181818] rounded-xl py-3 px-2">
            <div className="space-y-2">
              <Link
                to="/explore/movies"
                className="flex items-center gap-3 px-3 py-2 text-[15px] font-semibold text-white rounded hover:bg-white/10 transition"
              >
                <VideoCameraOutlined
                  className="text-[18px]"
                  style={{ color: "white" }}
                />
                {!isCompact && <span className="text-white">Movies</span>}
              </Link>
              <Link
                to="/explore/tv"
                className="flex items-center gap-3 px-3 py-2 text-[15px] font-semibold text-white rounded hover:bg-white/10 transition"
              >
                <DesktopOutlined
                  className="text-[18px]"
                  style={{ color: "white" }}
                />
                {!isCompact && <span className="text-white">TV Shows</span>}
              </Link>
            </div>

            <div className="space-y-2 pt-6">
              {/* WatchList with conditional login modal */}
              <Link
                to="/watchlist"
                onClick={handleWatchlistClick}
                className="flex items-center gap-3 px-3 py-2 text-[15px] font-semibold text-white rounded hover:bg-white/10 transition"
              >
                <HeartOutlined
                  className="text-[18px] "
                  style={{ color: "white" }}
                />
                {!isCompact && <span className="text-white">WatchList</span>}
              </Link>

              {/* Account Section */}
              <div className="pt-2">
                {token && userName ? (
                  <div
                    id="account-dropdown"
                    className="relative flex items-center gap-3 px-3 py-2 cursor-pointer rounded select-none"
                    onClick={() => setShowAccountOptions(!showAccountOptions)}
                  >
                    <UserOutlined
                      className="text-[18px]"
                      style={{ color: "white" }}
                    />
                    {!isCompact && (
                      <span className="text-white">{userName}</span>
                    )}

                    {/* Dropdown arrow */}
                    {!isCompact && (
                      <svg
                        className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                          showAccountOptions ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    )}

                    {/* Dropdown menu opening to the right */}
                    {showAccountOptions && !isCompact && (
                      <div className="absolute bottom-0  left-full ml-2 w-32 bg-[#181818] rounded-md shadow-lg border border-gray-700 z-50">
                        {role === "ROLE_ADMIN" && (
                          <button
                            onClick={() => {
                              navigate("/admin");
                              setShowAccountOptions(false);
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
                            setShowAccountOptions(false);
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
                  <div
                    onClick={() => setAuthModalState("login")}
                    className="flex items-center gap-3 px-3 py-2 cursor-pointer rounded "
                  >
                    <UserOutlined
                      className="text-[18px]"
                      style={{ color: "white" }}
                    />
                    {!isCompact && (
                      <button
                        className="text-white font-semibold hover:underline"
                        type="button"
                      >
                        Login
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className="flex-grow overflow-y-auto bg-zinc-900 pt-14 sm:pt-0 rounded-xl ml-2 mr-2 pb-20"
        id="scroll-container"
      >
        <div className="max-w-screen-xl w-full text-white">
          <Outlet />
        </div>
      </main>

      {/* Auth Modals */}
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

export default MainLayout;
