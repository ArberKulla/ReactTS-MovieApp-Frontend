import type { FunctionComponent } from "react";
import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import {
  HomeOutlined,
  SearchOutlined,
  PlayCircleOutlined,
  MenuOutlined,
} from "@ant-design/icons";

const MainLayout: FunctionComponent = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#000000]">
      {/* Mobile Sidebar Toggle */}
      <div className="sm:hidden absolute top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 border rounded shadow-md text-white bg-zinc-800"
        >
          <MenuOutlined />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0 transition-transform duration-200 fixed sm:static z-40 sm:z-10 bg-[#121212] w-56 h-full flex flex-col`}
      >
        <nav className="flex-grow py-6 px-6 space-y-4">
          <Link
            to="/"
            className="flex items-center space-x-2 text-gray-300 hover:text-white px-2 py-2 rounded transition"
          >
            <HomeOutlined />
            <span>Home</span>
          </Link>
          <Link
            to="/search"
            className="flex items-center space-x-2 text-gray-300 hover:text-white px-2 py-2 rounded transition"
          >
            <SearchOutlined />
            <span>Search</span>
          </Link>
          <Link
            to="/explore"
            className="flex items-center space-x-2 text-gray-300 hover:text-white px-2 py-2 rounded transition"
          >
            <PlayCircleOutlined />
            <span>Explore</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-grow overflow-y-auto bg-[#121212]">
        <div className="max-w-screen-xl mx-auto w-full text-white">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
