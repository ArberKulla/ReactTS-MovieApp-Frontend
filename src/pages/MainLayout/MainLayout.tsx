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
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Mobile Sidebar Toggle */}
      <div className="sm:hidden absolute top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-white border rounded shadow-md"
        >
          <MenuOutlined />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0 transition-transform duration-200 fixed sm:static z-40 sm:z-10 bg-white w-56 h-full border-r shadow-md flex flex-col`}
      >
        <nav className="flex-grow py-6 px-4 space-y-4">
          <Link
            to="/"
            className="flex items-center space-x-2 text-gray-700 hover:text-black px-2 py-2 rounded hover:bg-gray-100 transition"
          >
            <HomeOutlined />
            <span>Home</span>
          </Link>
          <Link
            to="/search"
            className="flex items-center space-x-2 text-gray-700 hover:text-black px-2 py-2 rounded hover:bg-gray-100 transition"
          >
            <SearchOutlined />
            <span>Search</span>
          </Link>
          <Link
            to="/explore"
            className="flex items-center space-x-2 text-gray-700 hover:text-black px-2 py-2 rounded hover:bg-gray-100 transition"
          >
            <PlayCircleOutlined />
            <span>Explore</span>
          </Link>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-grow overflow-y-auto bg-gray-100 p-4 sm:p-6 md:p-8">
        <div className="max-w-screen-xl mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
