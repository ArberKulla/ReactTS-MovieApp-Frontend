import React from "react";
import MovieDetails from "./MovieDetails";

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path?: string | null;
}

interface SideInfoMovie {
  showSidebar: boolean;
  setShowSidebar: (value: boolean) => void;
  title: string;
  poster: string;
  rating?: number | string;
  status: string;
  production: string;
  release: string;
  overview: string;
  genres: string[];
  cast: CastMember[];
  type?: string;
  seasons?: any;
  season?: any;
}

export const SideInfoMovie: React.FC<SideInfoMovie> = ({
  showSidebar,
  setShowSidebar,
  title,
  poster,
  rating,
  status,
  production,
  release,
  overview,
  genres,
  cast,
  type,
  seasons,
  season
}) => {
  return (
    <div
      className={`relative transition-all duration-300 overflow-hidden bg-zinc-900 border-zinc-700 ${
        showSidebar ? "w-[400px] pl-4 pt-2" : "w-0 p-0"
      }`}
    >
      {showSidebar && (
        <div className="overflow-y-auto h-full w-full">
          {/* Sticky Header */}
          <div className="sticky top-0 bg-zinc-900 z-30 flex justify-between items-center pt-2 pb-4 pr-4 pl-2  border-zinc-700">
            <h2 className="text-xl font-bold">{title}</h2>

            <button
              onClick={() => setShowSidebar(false)}
              className="text-white hover:text-gray-400 text-lg"
              title="Close"
            >
              ✕
            </button>
          </div>

          <MovieDetails
            poster={poster}
            title={title}
            rating={rating}
            status={status}
            production={production}
            release={release}
            overview={overview}
            genres={genres}
            cast={cast}
            type={type}
            seasons={seasons}
            season={season}
          />
        </div>
      )}
    </div>
  );
};
