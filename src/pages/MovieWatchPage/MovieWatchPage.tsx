import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { TMDB } from "../../configs/tmdb";
import { useAppDispatch } from "../../hooks/dispatch";
import { useSelector } from "react-redux";
import type { RootState } from "../../data/store";
import { fetchMovies } from "../../data/moviesSlice";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { SideInfoMovie } from "../../modules/MovieWatchPage/SideInfoMovie"; 
import { VideoPlayer } from "../../modules/MovieWatchPage/VideoPlayer";

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
  const release = currentMovie?.release_date
    ? new Date(currentMovie.release_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown";
  const production =
  currentMovie?.production_companies?.[0]?.name || "Unknown";
  const genres = currentMovie?.genres?.map((genre: any) => genre.name) || [];
  const cast = currentMovie?.credits?.cast?.slice(0, 6) || [];
  const trailers = currentMovie?.videos?.results.filter(
    (video: any) => video.type === "Trailer" && video.site === "YouTube"
  );

  const teasers = currentMovie?.videos?.results.filter(
    (video: any) => video.type === "Teaser" && video.site === "YouTube"
  );
  const backdrop_path = currentMovie?.backdrop_path

  return (
    <div className="flex h-screen bg-[#121212] text-white relative">

      {/* Video Player */}
      <VideoPlayer
          id={id}
          selectedSource={selectedSource}
          setSelectedSource={setSelectedSource}
          sources={sources}
          showSidebar={showSidebar}
          trailers={trailers}
          teasers={teasers}
          backdrop_path={backdrop_path}
      />

      {/* Sidebar */}
      <SideInfoMovie
        title={title}
        poster={poster}
        rating={rating}
        overview={overview}
        status={status}
        production={production}
        release={release}
        genres={genres}
        cast={cast}
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
      />

      {/* Sidebar Toggle Button */}
      {!showSidebar && (
        <div
          onClick={() => setShowSidebar(true)}
          className="fixed top-0 right-0 h-full w-12 z-50 cursor-pointer group"
        >
          {/* Transparent base */}
          <div className="h-full w-full bg-transparent relative flex items-center justify-center">
            {/* Gradient overlay with fade-in */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out bg-gradient-to-l from-black from-60% to-transparent pointer-events-none"></div>

            {/* Arrow Icon */}
            <div className="absolute right-2 text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out z-10">
              <ArrowLeftOutlined />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MovieWatchPage;
