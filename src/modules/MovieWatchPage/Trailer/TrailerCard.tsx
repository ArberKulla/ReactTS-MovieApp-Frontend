import React from "react";

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: "Trailer" | "Teaser" | string;
  published_at: string;
}

interface TrailerCardProps {
  video: Video;
  onClick: () => void;
  backdrop_path?: string;
}

const TrailerCard: React.FC<TrailerCardProps> = ({ video, onClick, backdrop_path }) => {
  const backdropUrl = backdrop_path
    ? `https://image.tmdb.org/t/p/w300${backdrop_path}`
    : null;

  const formattedDate = video.published_at
    ? new Date(video.published_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer w-48 h-28 rounded-lg overflow-hidden relative transition-all ${
        backdropUrl ? "" : "bg-zinc-900 hover:bg-zinc-900"
      }`}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      style={
        backdropUrl
          ? {
              backgroundImage: `url(${backdropUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      {/* Gradient overlay if there's a background image */}
      {backdropUrl && (
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
      )}

      {/* Text content */}
      <div className="absolute bottom-0 left-0 p-2 z-10 w-full">
        <p className="text-white font-semibold text-sm truncate">{video.name}</p>
        <p className="text-gray-300 text-xs truncate">
          {video.type}
          {formattedDate && (
            <>
              {" • "}
              <span>{formattedDate}</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default TrailerCard;
