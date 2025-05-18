import React, { useState, useRef, useEffect } from "react";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import TrailerCard from "./TrailerCard";
import type { Video } from "./TrailerCard";

interface TrailerSliderProps {
  trailers: Video[];
  teasers: Video[];
  modalVideo: Video | null;
  setModalVideo: (video: Video) => void;
  title?: string;
  backdrop_path?: string;
}

const TrailerSlider: React.FC<TrailerSliderProps> = ({
  trailers,
  teasers,
  modalVideo,
  setModalVideo,
  title = "More Videos",
  backdrop_path
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);

    const videos = [...(trailers || []), ...(teasers || [])];

  const updateScrollButtons = () => {
    const container = scrollRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;

    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => updateScrollButtons();
    const handleResize = () => updateScrollButtons();

    container.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    updateScrollButtons();

    return () => {
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [videos]);

  const scrollLeft = () => {
    if (isScrolling) return;
    setIsScrolling(true);
    scrollRef.current?.scrollBy({ left: -1600, behavior: "smooth" });
    setTimeout(() => {
      updateScrollButtons();
      setIsScrolling(false);
    }, 500);
  };

  const scrollRight = () => {
    if (isScrolling) return;
    setIsScrolling(true);
    scrollRef.current?.scrollBy({ left: 1600, behavior: "smooth" });
    setTimeout(() => {
      updateScrollButtons();
      setIsScrolling(false);
    }, 500);
  };

  if (videos.length === 0) return null;

  return (
    <div className="relative py-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <div className="space-x-1">
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={`px-3 py-1 rounded ${
              canScrollLeft
                ? "bg-zinc-900 hover:bg-zinc-600 text-white"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
          >
            <ArrowLeftOutlined />
          </button>

          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={`px-3 py-1 rounded ${
              canScrollRight
                ? "bg-zinc-900 hover:bg-zinc-600 text-white"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
          >
            <ArrowRightOutlined />
          </button>
        </div>
      </div>

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className="flex w-full overflow-x-auto hide-scrollbar "
        style={{ scrollBehavior: "smooth" }}
      >
        <div className="flex space-x-4">
          {videos?.map((video) => (
            <TrailerCard
              key={video.key}
              video={video}
              backdrop_path={backdrop_path}
              onClick={() => setModalVideo(video)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrailerSlider;
