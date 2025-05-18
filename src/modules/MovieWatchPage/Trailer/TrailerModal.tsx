import React from "react";

export interface Video {
  key: string;
  name: string;
}

interface VideoModalProps {
  video: Video;
  onClose: () => void;
}

const TrailerModal: React.FC<VideoModalProps> = ({ video, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-zinc-900 rounded-lg p-4 max-w-3xl w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-xl font-bold"
          aria-label="Close modal"
        >
          ✕
        </button>
        <iframe
          className="w-full aspect-video rounded"
          src={`https://www.youtube.com/embed/${video.key}`}
          allowFullScreen
          title={video.name}
          frameBorder={0}
        />
      </div>
    </div>
  );
};

export default TrailerModal;
