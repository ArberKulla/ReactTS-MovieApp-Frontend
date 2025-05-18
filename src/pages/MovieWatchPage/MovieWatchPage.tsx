import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { TMDB } from "../../configs/tmdb";
import { useAppDispatch } from "../../hooks/dispatch";
import { useSelector } from "react-redux";
import type { RootState } from "../../data/store";
import { fetchMovies } from "../../data/moviesSlice";

const sources = [
  { name: "Vidsrc", url: (id: string) => `https://vidsrc.to/embed/movie/${id}` },
  { name: "Vidcloud", url: (id: string) => `https://vidcloud9.com/embed/movie/${id}` },
];

const MovieWatchPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const [selectedSource, setSelectedSource] = useState(sources[0]);
  const [showSidebar, setShowSidebar] = useState(true);
  const state = useSelector((state: RootState) => state);
  const { movies } = state.movies;
  const [currentMovie, setCurrentMovie] = useState<any>(null);

  const MOVIEAPIURL = TMDB.getMovieDetails(id || "");

  useEffect(() => {
    dispatch(fetchMovies(MOVIEAPIURL));
  }, [dispatch, MOVIEAPIURL]);

  useEffect(() => {
    setCurrentMovie(movies);
  }, [movies]);

  const poster = currentMovie?.poster_path
    ? `https://image.tmdb.org/t/p/w500${currentMovie.poster_path}`
    : "/fallback.jpg";

  const rating = currentMovie?.vote_average?.toFixed(1);
  const title = currentMovie?.title || "Untitled";
  const overview = currentMovie?.overview || "No description available.";
  const status = currentMovie?.status;
  const release = currentMovie?.release_date;
  const production =
    currentMovie?.production_companies?.map((p: any) => p.name).join(", ") ||
    "Unknown";

  const cast = currentMovie?.credits?.cast?.slice(0, 6) || [];

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden relative">
      {/* Left: Video & Source Selector */}
      <div
        className={`flex flex-col transition-all duration-300 ${
          showSidebar ? "w-[calc(100%-320px)]" : "w-full"
        }`}
      >
        <div className="flex-1 overflow-y-auto p-4">
        <div className="w-full aspect-video rounded-lg border-2 border-zinc-700 overflow-hidden">
        <iframe
            src={selectedSource.url(id || "")}
            allowFullScreen
            title="Movie Player"
            className="w-full h-full"
        />
        </div>

          {/* Source Selector */}
          <div className="mt-4">
            <label className="mr-2">Choose source:</label>
            <select
              value={selectedSource.name}
              onChange={(e) =>
                setSelectedSource(
                  sources.find((s) => s.name === e.target.value) || sources[0]
                )
              }
              className="bg-zinc-800 text-white p-2 rounded"
            >
              {sources.map((source) => (
                <option key={source.name} value={source.name}>
                  {source.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`relative transition-all duration-300 overflow-hidden bg-zinc-900 border-l border-zinc-700 ${
          showSidebar ? "w-[300px] p-4" : "w-0 p-0"
        }`}
      >
        {/* Toggle Button inside sidebar */}
        {showSidebar && (
          <button
            onClick={() => setShowSidebar(false)}
            className="absolute top-2 left-2 text-xs bg-zinc-700 hover:bg-zinc-600 text-white py-1 px-2 rounded z-10"
          >
            {"<<"}
          </button>
        )}

        {showSidebar && (
          <div className="overflow-y-auto h-full pr-2 pt-8">
            {/* Poster and Rating */}
            <div className="relative">
              <img
                src={poster}
                alt={title}
                className="w-full rounded-lg mb-4"
              />
              {rating && (
                <span className="absolute top-2 right-2 bg-yellow-500 text-black font-bold text-sm px-2 py-1 rounded">
                  {rating}
                </span>
              )}
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold">{title}</h2>

            {/* Meta Info */}
            <div className="text-sm text-gray-400 mt-2">
              <p>
                <strong>Status:</strong> {status}
              </p>
              <p>
                <strong>Production:</strong> {production}
              </p>
              <p>
                <strong>Released:</strong> {release}
              </p>
            </div>

            {/* Overview */}
            <p className="text-sm text-gray-300 mt-4">{overview}</p>

            {/* Cast */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Top Cast</h3>
              {cast.length === 0 && (
                <p className="text-sm text-gray-400">No cast data available.</p>
              )}
              <div className="space-y-4">
                {cast.map((member: any) => (
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
            </div>
          </div>
        )}
      </div>

      {/* Hover Reveal Button (when sidebar hidden) */}
      {!showSidebar && (
        <div className="absolute top-0 right-0 h-full w-2 group z-20">
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={() => setShowSidebar(true)}
              className="text-xs bg-zinc-600 bg-opacity-50 hover:bg-opacity-70 text-white py-1 px-2 rounded"
            >
              {">>"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieWatchPage;
