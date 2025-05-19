import './MovieSlider.scss';
import { useState, useRef, useEffect } from "react";
import type { FC } from "react";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import MoviePopup from '../SearchComponents/MoviePopup';
import MovieCard from '../SearchComponents/MovieCard';

interface MovieSliderProps {
  movies: any[];
  title: string;
  type?: string;
}

const POPUP_WIDTH = 256;
const POPUP_HEIGHT = 320;
const GAP = 4;

const MovieSlider: FC<MovieSliderProps> = ({ movies, title, type }) => {
  const [hoveredMovie, setHoveredMovie] = useState<any | null>(null);
  const [popupPos, setPopupPos] = useState<{ top: number; left: number } | null>(null);
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [isPopupHovered, setIsPopupHovered] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

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
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  const handleCardMouseEnter = (movie: any, e: React.MouseEvent<HTMLDivElement>) => {
    setHoveredMovie(movie);
    setIsCardHovered(true);

    const cardRect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let left = cardRect.right + GAP;
    let top = cardRect.top - 25;

    // Check if popup overflows horizontally
    if (cardRect.right + POPUP_WIDTH + GAP > viewportWidth) {
      if (cardRect.left - POPUP_WIDTH - GAP > 0) {
        left = cardRect.left - POPUP_WIDTH - GAP;
      } else {
        left = cardRect.left;
      }
    }

    // Check if popup overflows vertically and raise it if needed
    if (top + POPUP_HEIGHT > viewportHeight) {
      top = viewportHeight - 1.3*POPUP_HEIGHT - GAP;
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
    setTimeout(() => {
      updateScrollButtons();
      setIsScrolling(false);
    }, 500);
  };

  const scrollRight = () => {
    if (isScrolling) return;
    setIsScrolling(true);
    scrollRef.current?.scrollBy({ left: 800, behavior: "smooth" });
    setTimeout(() => {
      updateScrollButtons();
      setIsScrolling(false);
    }, 500);
  };

  return (
    <div className="relative py-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <div>
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={`px-3 py-1 rounded ${canScrollLeft ? "bg-zinc-900 hover:bg-zinc-600 text-white" : "bg-gray-400 text-gray-200 cursor-not-allowed"}`}
          >
            <ArrowLeftOutlined />
          </button>
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={`ml-2 px-3 py-1 rounded ${canScrollRight ? "bg-zinc-900 hover:bg-zinc-600 text-white" : "bg-gray-400 text-gray-200 cursor-not-allowed"}`}
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
        <div className="flex space-x-4 py-2 max-w-full">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onMouseEnter={(e) => handleCardMouseEnter(movie, e)}
              onMouseLeave={handleCardMouseLeave}
              type={type}
            />
          ))}
        </div>
      </div>

      {/* Popup */}
      {(isCardHovered || isPopupHovered) && hoveredMovie && (
        <MoviePopup
          movie={hoveredMovie}
          top={popupPos?.top}
          left={popupPos?.left}
          onMouseEnter={handlePopupMouseEnter}
          onMouseLeave={handlePopupMouseLeave}
          type={type}
        />
      )}
    </div>
  );
};

export default MovieSlider;
