import { useState, useEffect } from "react";

type Movie = {
  id: number;
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  overview?: string;
  poster_path?: string;
  backdrop_path?: string;
};

const IMAGE_BASE = "https://image.tmdb.org/t/p/original";

const HeroSlider = ({ movies }: { movies: Movie[] }) => {
  const [current, setCurrent] = useState(0);

  // Reset current index when movies change
  useEffect(() => {
    setCurrent(0);
  }, [movies]);

  // Slide change interval
  useEffect(() => {
    if (movies.length === 0) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % movies.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [movies]);

  if (!movies.length) return <div>Loading movies...</div>;

  const movie = movies[current];
  if (!movie) return null;

  const title = movie.title || movie.name || "Untitled";
  const date = movie.release_date || movie.first_air_date || "";
  const rating = movie.vote_average?.toFixed(1) ?? "N/A";
  const poster = `${IMAGE_BASE}${movie.poster_path}?v=${current}`;

  const backdrop = `${IMAGE_BASE}${movie.backdrop_path}`;

  return (
    <div className="relative w-full h-[60vh] text-white px-4 md:px-8">
      <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-lg">
        {/* Background Image with transition */}
        <div
          key={backdrop}
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 blur-sm brightness-[.4]"
          style={{ backgroundImage: `url(${backdrop})` }}
        />

        {/* Overlay Content */}
        <div className="relative z-10 flex items-center justify-between h-full max-w-7xl mx-auto px-6">
          {/* Left: Text */}
          <div className="max-w-xl space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-200">
              <span>TV</span>
              <span>
                {new Date(date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <span>⭐ {rating}</span>
            </div>
            <p className="text-sm md:text-base text-gray-300 line-clamp-3">
              {movie.overview}
            </p>
            <div className="flex gap-3 mt-4">
              {/* Watch Now Button */}
              <button className="flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 text-white font-medium hover:bg-white/20 transition">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 fill-white"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch Now
              </button>

              {/* Plus Button */}
              <button className="w-10 h-10 rounded-full flex items-center justify-center border border-white/30 text-white hover:bg-white/20 transition">
                +
              </button>
            </div>
          </div>

          {/* Right: Poster Image */}
          <div className="hidden md:block w-[250px] md:w-[300px] lg:w-[360px] transform rotate-10  shadow-xl">
            {movie.poster_path && (
              <img
                key={movie.poster_path}
                src={poster}
                alt={title}
                className="w-full h-auto rounded-lg"
              />
            )}
          </div>
        </div>

        {/* Dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {movies.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-3 h-3 rounded-full transition ${
                idx === current ? "bg-white" : "bg-gray-500"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;
