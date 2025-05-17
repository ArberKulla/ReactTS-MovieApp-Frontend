import './MovieSlider.scss';
import { useState, useRef, useEffect } from "react";
import type { FC } from "react";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { FaS } from 'react-icons/fa6';

interface MovieSliderProps {
  movies: any[];
}

const POPUP_WIDTH = 256;
const POPUP_HEIGHT = 200;
const GAP = 4;

const MovieSlider: FC<MovieSliderProps> = ({ movies }) => {
  const [hoveredMovie, setHoveredMovie] = useState<any | null>(null);
  const [popupPos, setPopupPos] = useState<{ top: number; left: number } | null>(null);
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [isPopupHovered, setIsPopupHovered] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => updateScrollButtons();
    const handleResize = () => updateScrollButtons();

    container.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    const timeout = setTimeout(updateScrollButtons, 100);

    return () => {
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeout);
    };
  }, [movies]);

  const updateScrollButtons = () => {
    const container = scrollRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;

    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1); // `-1` for rounding issues
  };


  const scrollRef = useRef<HTMLDivElement>(null);

  const handleCardMouseEnter = (movie: any, e: React.MouseEvent<HTMLDivElement>) => {
    setHoveredMovie(movie);
    setIsCardHovered(true);

    const cardRect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const viewportWidth = window.innerWidth;

    let left = cardRect.right + GAP;
    let top = cardRect.top;

    if (cardRect.right + POPUP_WIDTH + GAP > viewportWidth) {
      if (cardRect.left - POPUP_WIDTH - GAP > 0) {
        left = cardRect.left - POPUP_WIDTH - GAP;
      } else {
        left = cardRect.left;
      }
    }

    setPopupPos({ top: top + window.scrollY, left: left + window.scrollX });
  };

  const handleCardMouseLeave = () => setIsCardHovered(false);
  const handlePopupMouseEnter = () => setIsPopupHovered(true);
  const handlePopupMouseLeave = () => setIsPopupHovered(false);

  const scrollLeft = () => {
    if (isScrolling) return;
    setIsScrolling(true);
    scrollRef.current?.scrollBy({ left: -800, behavior: "smooth" });
    setTimeout(()=> {
      updateScrollButtons();
      setIsScrolling(false); 
    }, 500);
  };

  const scrollRight = () => {
    if (isScrolling) return;
    setIsScrolling(true);
    scrollRef.current?.scrollBy({ left: 800, behavior: "smooth" });
    setTimeout(()=> {
      updateScrollButtons();
      setIsScrolling(false); 
    }, 500);  };


  return (
    <div className="relative py-4">
      {/* Header */}
      <div className="flex justify-between items-center px-4 mb-2">
        <h2 className="text-xl font-bold text-black">Trending Movies</h2>
        <div className="space-x-2">
        <button
          onClick={scrollLeft}
          disabled={!canScrollLeft}
          className={`px-3 py-1 rounded ${canScrollLeft ? "bg-zinc-700 hover:bg-zinc-600 text-white" : "bg-gray-400 text-gray-200 cursor-not-allowed"}`}
        >
          <ArrowLeftOutlined />
        </button>

        <button
          onClick={scrollRight}
          disabled={!canScrollRight}
          className={`px-3 py-1 rounded ${canScrollRight ? "bg-zinc-700 hover:bg-zinc-600 text-white" : "bg-gray-400 text-gray-200 cursor-not-allowed"}`}
        >
          <ArrowRightOutlined />
        </button>
        </div>
      </div>

      {/* Scrollable Container */}
    <div
      ref={scrollRef}
      className="flex w-full hide-scrollbar"
      style={{
        overflowY: 'hidden',
        overflowX: isCardHovered || isPopupHovered ? 'hidden' : 'auto',
      }}
    >

        <div className="flex space-x-4 max-w-full">
          {movies.map((movie) => (
            <div
              key={movie.id}
              onMouseEnter={(e) => handleCardMouseEnter(movie, e)}
              onMouseLeave={handleCardMouseLeave}
              className="relative min-w-[150px] max-w-[150px] transition duration-200 transform hover:scale-105 m-2"
            >
              <img
                src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                alt={movie.title}
                className="h-[220px] w-full object-cover rounded-lg"
              />
              <div className="text-yellow-400 text-sm font-semibold absolute top-2 right-2 bg-zinc-900 px-1 py-1 leading-none pointer-events-none z-10 rounded-md">
                <span>★ </span>
                <span className="text-white">{movie.vote_average?.toFixed(1)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popup */}
      {(isCardHovered || isPopupHovered) && hoveredMovie && (
        <div
          onMouseEnter={handlePopupMouseEnter}
          onMouseLeave={handlePopupMouseLeave}
          className="fixed w-64 p-4 bg-zinc-800 text-white rounded-lg shadow-lg z-[9999] overflow-hidden"
          style={{
            top: popupPos?.top,
            left: popupPos?.left,
            height: POPUP_HEIGHT,
            pointerEvents: "auto",
            cursor: "default",
          }}
        >
          <h3 className="text-lg font-semibold">{hoveredMovie.title}</h3>
          <p className="text-sm mt-2 line-clamp-4 text-gray-300 overflow-hidden">
            {hoveredMovie.overview}
          </p>
          <button className="mt-4 w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded cursor-pointer">
            Watch Now
          </button>
        </div>
      )}
    </div>
  );
};

export default MovieSlider;
