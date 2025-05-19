import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path?: string | null;
}

interface Season {
  season_number: number;
  name: string;
  episode_count: number;
}

interface MovieDetailsProps {
  poster: string;
  title: string;
  rating?: number | string;
  status: string;
  production: string;
  release: string;
  overview: string;
  genres: string[];
  cast: CastMember[];
  type?: string;
  seasons?: any[];
  season?: any;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({
  poster,
  title,
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
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [episodeSearch, setEpisodeSearch] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleEpisodeClick = (episode: number) => {
    const path = location.pathname.split("?")[0];
    const queryParams = new URLSearchParams();
    if (selectedSeason !== null) queryParams.set("season", selectedSeason.toString());
    queryParams.set("episode", episode.toString());
    navigate(`${path}?${queryParams.toString()}`);
  };

  const handleSeasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const newSeason = Number(e.target.value);
  setSelectedSeason(newSeason);
  const path = location.pathname.split("?")[0];
  const queryParams = new URLSearchParams();
  queryParams.set("season", newSeason.toString());
  queryParams.set("episode", "1");
  navigate(`${path}?${queryParams.toString()}`);
};


  return (
    <div className="w-full px-2 text-white pb-6">

{/* Season Selector with Search */}
{type === "tv" && (
  <div className="bg-zinc-900 bg-opacity-80 rounded-lg shadow-inner">
    <label className="text-xs block mb-2 text-gray-300 font-medium">Select Season:</label>
    <div className="flex gap-2 items-center flex-wrap sm:flex-nowrap">
      <div className="relative w-full sm:w-1/2">
        <select
          value={selectedSeason}
          onChange={handleSeasonChange}
          className="w-full appearance-none bg-zinc-800 text-white text-sm px-3 py-2 rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          {seasons
            ?.filter((season) => season.season_number > 0)
            .map((season) => (
              <option key={season.season_number} value={season.season_number}>
                {season.name}
              </option>
            ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
          ▼
        </div>
      </div>

      {/* Episode Filter Input */}
      <input
        type="text"
        placeholder="Search episodes..."
        value={episodeSearch}
        onChange={(e) => setEpisodeSearch(e.target.value)}
        className="w-full sm:w-1/2 bg-zinc-800 text-white text-sm px-3 py-2 rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />
    </div>
  </div>
)}


{/* Episodes List - Vertical Full Width */}
{type === "tv" && (
  <div className="mt-4 border-b border-gray-800 pb-2">
    <h4 className="text-sm font-semibold text-gray-300 mb-2">Episodes in Season {selectedSeason}:</h4>
    <div className="flex flex-col gap-2 max-h-70 overflow-y-auto pr-1">
      {(season?.episodes || [])
        .filter((ep: any) =>
          ep?.name?.toLowerCase().includes(episodeSearch.toLowerCase())
        )
        .map((ep: any, index: number) => (
          <button
            key={index}
            onClick={() => handleEpisodeClick(index + 1)}
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-white text-xs px-3 py-3 rounded-lg shadow transition-all duration-200 text-left"
          >
            {ep?.name
              ? `${index + 1}. ${ep.name}`
              : `Episode ${index + 1}`}
          </button>
        ))}
    </div>
  </div>
)}

      {/* Poster + Meta Row */}
      <div className="flex flex-row gap-4 mb-4 py-4">
        <div className="max-w-[160px] rounded-lg relative">
          <img src={poster} alt={title} className="w-full rounded-xl" />
          {rating && (
            <div className="text-yellow-400 text-sm font-semibold absolute top-2 right-2 bg-zinc-900 px-1 py-1 leading-none pointer-events-none z-10 rounded-md">
              <span>★ </span>
              <span className="text-white">{rating}</span>
            </div>
          )}
        </div>

        {/* Meta Info */}
        <div className="flex flex-col justify-center text-sm text-gray-400 space-y-1 gap-5">
          <p>
            <strong>Status:</strong> <br /> {status}
          </p>
          <p>
            <strong>Production:</strong> <br /> {production}
          </p>
          <p>
            <strong>Released:</strong> <br /> {release}
          </p>
        </div>
      </div>

      {/* Overview */}
      <p className="text-sm text-gray-300 mt-6">{overview}</p>

      {/* Genres */}
      {genres.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-6">
          {genres.map((genre, index) => (
            <p
              key={index}
              className="bg-zinc-900 text-gray-200 text-sm font-semibold px-4 py-2 rounded-full"
            >
              {genre}
            </p>
          ))}
        </div>
      )}

      {/* Cast */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Actors</h3>
        {cast.length === 0 ? (
          <p className="text-sm text-gray-400">No cast data available.</p>
        ) : (
          <div className="space-y-4">
            {cast.map((member) => (
              <div key={member.id} className="flex items-center space-x-3">
                <img
                  src={
                    member.profile_path
                      ? `https://image.tmdb.org/t/p/w185${member.profile_path}`
                      : "/fallback.jpg"
                  }
                  alt={member.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="text-sm">
                  <p className="font-medium">{member.name}</p>
                  <p className="text-gray-400">{member.character}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
