import React, { useState, useEffect} from "react";
import TrailerCard from "./Trailer/TrailerCard";
import TrailerModal from "./Trailer/TrailerModal";
import TrailerSlider from "./Trailer/TrailerSlider";
import { TMDB } from "../../configs/tmdb";
import { useAppDispatch } from "../../hooks/dispatch";
import { useSelector } from "react-redux";
import type { RootState } from "../../data/store";
import { fetchMovies } from "../../data/moviesSlice";
import { fetchRecommendedMovies } from "../../data/moviesRecommendedSlice";
import MovieSlider from "../MovieSlider/MovieSlider";

interface Source {
  name: string;
  url: (id: string) => string;
}

interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: "Trailer" | "Teaser" | string;
  published_at: string;
}

interface VideoPlayerProps {
  id?: string;
  selectedSource: Source;
  setSelectedSource: (source: Source) => void;
  sources: Source[];
  showSidebar: boolean;
  trailers: Video[];
  teasers: Video[];
  backdrop_path?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  id,
  selectedSource,
  setSelectedSource,
  sources,
  showSidebar,
  trailers,
  teasers,
  backdrop_path
}) => {
  const MOVIEAPIURL = TMDB.getRecommendedMovies(id || "");
  const [modalVideo, setModalVideo] = useState<Video | null>(null);
  const state = useSelector((state: RootState) => state);
  const { recommendedMovies } = state.recommendedMovies;
  const dispatch = useAppDispatch();

    useEffect(() => {
      dispatch(fetchRecommendedMovies(MOVIEAPIURL));
    }, [dispatch, MOVIEAPIURL]);
  

  // Show More Videos section only if there is at least one trailer or teaser
  const hasMoreVideos = trailers?.length > 0 || teasers?.length > 0;

  return (
    <div
      className={`flex flex-col transition-all duration-300 bg-zinc-900 ${
        showSidebar ? "w-[calc(100%-360px)]" : "w-full"
      }`}
    >
      <div className="flex-1 overflow-y-auto p-4">
        {/* Main Video */}
        <div className="w-full aspect-video rounded-lg overflow-hidden">
          <iframe
            src={selectedSource.url(id || "")}
            allowFullScreen
            title="Movie Player"
            className="w-full h-full"
          />
        </div>

        {/* Source Selector */}
        <div className="mt-4">
          <label className="mr-2 text-white text-xl">Source</label>
          <div className="relative inline-block w-30 group">
            <select
              value={selectedSource.name}
              onChange={(e) =>
                setSelectedSource(
                  sources.find((s) => s.name === e.target.value) || sources[0]
                )
              }
              className="appearance-none w-full bg-zinc-900 text-white py-2 px-3 pr-8 rounded focus:outline-none hover:bg-zinc-900 transition-colors duration-200"
            >
              {sources.map((source) => (
                <option key={source.name} value={source.name}>
                  {source.name}
                </option>
              ))}
            </select>
            {/* Custom arrow */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white group-hover:text-gray-300">
              <svg
                className="h-4 w-4 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* More Videos Section */}
        {hasMoreVideos && (
        <TrailerSlider
          trailers={trailers}
          teasers={teasers}
          modalVideo={modalVideo}
          setModalVideo={setModalVideo}
          backdrop_path={backdrop_path}
        />
        )}

        {/* Modal for Trailer/Teaser */}
        {modalVideo && (
          <TrailerModal
            video={modalVideo}
            onClose={() => setModalVideo(null)}
          />
        )}

        {recommendedMovies && (
          console.log(recommendedMovies?.results),
          <MovieSlider
            movies={recommendedMovies?.results || []}
            title="Recommended Movies"
          />
        )}

        {/* Footer */}
        <div className="pb-20">
        </div>
      </div>
    </div>
  );
};

