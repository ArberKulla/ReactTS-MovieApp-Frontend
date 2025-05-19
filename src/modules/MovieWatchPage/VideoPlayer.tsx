import React, { useState, useEffect } from "react";
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
import useIsMobile from "../../hooks/useMobile";
import MovieDetails from "./MovieDetails";
import type { CastMember } from "./MovieDetails";
import type { Source } from "../../pages/MovieWatchPage/MovieWatchPage";
import { useParams } from "react-router-dom";

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
  seasonNumber?: number;
  episodeNumber?: number;
  seasons?: any[];
  season?: any;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  id,
  selectedSource,
  setSelectedSource,
  sources,
  showSidebar,
  trailers,
  teasers,
  backdrop_path,
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
  seasonNumber,
  episodeNumber,
  seasons,
  season
}) => {
  const MOVIEAPIURL =
    type === "tv"
      ? TMDB.getRecommendedShows(id || "")
      : TMDB.getRecommendedMovies(id || "");

  const [modalVideo, setModalVideo] = useState<Video | null>(null);
  const state = useSelector((state: RootState) => state);
  const { recommendedMovies } = state.recommendedMovies;
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();

  useEffect(() => {
    dispatch(fetchRecommendedMovies(MOVIEAPIURL));
  }, [dispatch, MOVIEAPIURL]);

  const hasMoreVideos = trailers?.length > 0 || teasers?.length > 0;

  return (
    <div
      className={`flex flex-col transition-all duration-300 bg-zinc-900 ${
        !showSidebar || isMobile ? "w-full" : "w-[calc(100%-360px)]"
      }`}
    >
      <div className="flex-1 overflow-y-auto p-4">
        {/* Main Video */}
        <div className="w-full aspect-video rounded-lg overflow-hidden">
          <iframe
            src={
              type === "tv"
                ? selectedSource.url(id || "", "tv", seasonNumber, episodeNumber)
                : selectedSource.url(id || "", "movie")
            }
            allowFullScreen
            title="Video Player"
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

        {isMobile && (
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
        )}

        {hasMoreVideos && (
          <TrailerSlider
            trailers={trailers}
            teasers={teasers}
            modalVideo={modalVideo}
            setModalVideo={setModalVideo}
            backdrop_path={backdrop_path}
          />
        )}

        {modalVideo && (
          <TrailerModal video={modalVideo} onClose={() => setModalVideo(null)} />
        )}

        {recommendedMovies && (
          <MovieSlider
            movies={recommendedMovies?.results || []}
            title={type === "tv" ? "Recommended Shows" : "Recommended Movies"}
            type={type}
          />
        )}

        <div className="pb-20"></div>
      </div>
    </div>
  );
};
