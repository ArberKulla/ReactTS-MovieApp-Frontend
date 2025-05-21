import type { FunctionComponent } from "react";
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  HomeOutlined,
  SearchOutlined,
  VideoCameraOutlined,
  DesktopOutlined,
  ClockCircleOutlined,
  HeartOutlined,
} from "@ant-design/icons";

const MainLayout: FunctionComponent = () => {
  const [isCompact, setIsCompact] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setIsCompact(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#000]">
      {/* Top Navigation Bar for Mobile */}
      <div className="sm:hidden fixed top-0 left-0 right-0 bg-[#121212] z-50 flex justify-around py-3 border-b border-zinc-800">
        <Link
          to="/"
          className={`flex flex-col items-center text-white text-[15px]`}
        >
          <HomeOutlined className="text-[18px]" style={{ color: 'white'}}/>
          <span className="text-xs text-white">All</span>
        </Link>
        <Link
          to="/movies"
          className={`flex flex-col items-center text-white text-[15px]`}
        >
          <VideoCameraOutlined className="text-[18px]" style={{ color: 'white'}}/>
          <span className="text-xs text-white">Movies</span>
        </Link>
        <Link
          to="/tv"
          className={`flex flex-col items-center text-white text-[15px]`}
        >
          <DesktopOutlined className="text-[18px]" style={{ color: 'white'}}/>
          <span className="text-xs text-white">TV</span>
        </Link>
      </div>

      {/* Sidebar for Desktop */}
      <aside
        className={`hidden sm:flex bg-[#121212] ${
          isCompact ? "w-16" : "w-56"
        } h-full flex-col rounded-r-xl`}
      >
        <nav className="flex flex-col h-full py-6 px-2 text-white space-y-4">
          {/* Top Section */}
          <div className="bg-[#181818] rounded-xl py-3 px-2 space-y-2">
            <Link
              to="/"
              className="flex items-center gap-3 px-3 py-2 text-[15px] font-semibold text-white rounded hover:bg-white/10 transition"
            >
              <HomeOutlined className="text-[18px]" style={{ color: 'white'}}/>
              {!isCompact && <span className="text-white">Home</span>}
            </Link>
            <Link
              to="/search"
              className="flex items-center gap-3 px-3 py-2 text-[15px] font-semibold text-white rounded hover:bg-white/10 transition"
            >
              <SearchOutlined className="text-[18px]" style={{ color: 'white'}} />
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
                <VideoCameraOutlined className="text-[18px]" style={{ color: 'white'}}/>
                {!isCompact && <span className="text-white">Movies</span>}
              </Link>
              <Link
                to="/explore/tv"
                className="flex items-center gap-3 px-3 py-2 text-[15px] font-semibold text-white rounded hover:bg-white/10 transition"
              >
                <DesktopOutlined className="text-[18px]" style={{ color: 'white'}}/>
                {!isCompact && <span className="text-white">TV Shows</span>}
              </Link>
            </div>

            <div className="space-y-2 pt-6">
              <Link
                to="/watchlist"
                className="flex items-center gap-3 px-3 py-2 text-[15px] font-semibold text-white rounded hover:bg-white/10 transition"
              >
                <HeartOutlined className="text-[18px]" style={{ color: 'white'}}/>
                {!isCompact && <span className="text-white">WatchList</span>}
              </Link>
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-grow overflow-y-auto bg-zinc-900 pt-14 sm:pt-0" id="scroll-container">
        <div className="max-w-screen-xl w-full text-white">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
