import React from "react";

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path?: string | null;
}

interface MovieDetailsProps {
  poster: string;
  title: string;
  rating?: number | string;
  status: string;
  production: string;
  release: string;
  overview: string;
  genres: string[];
  cast: CastMember[];
}

const MovieDetails: React.FC<MovieDetailsProps> = ({
  poster,
  title,
  rating,
  status,
  production,
  release,
  overview,
  genres,
  cast,
}) => {
  return (
    <div className="w-full px-4 py-6 text-white">
      {/* Poster + Meta Row */}
      <div className="flex flex-row gap-4 mb-4">
        {/* Poster */}
        <div className="max-w-[160px] rounded-lg relative">
          <img src={poster} alt={title} className="w-full rounded-xl" />
          {rating && (
            <div className="text-yellow-400 text-sm font-semibold absolute top-2 right-2 bg-zinc-900 px-1 py-1 leading-none pointer-events-none z-10 rounded-md">
              <span>★ </span>
              <span className="text-white">{rating}</span>
            </div>
          )}
        </div>

        {/* Meta Info */}
        <div className="flex flex-col justify-center text-sm text-gray-400 space-y-1 gap-5">
          <p>
            <strong>Status:</strong> <br /> {status}
          </p>
          <p>
            <strong>Production:</strong> <br /> {production}
          </p>
          <p>
            <strong>Released:</strong> <br /> {release}
          </p>
        </div>
      </div>

      {/* Overview */}
      <p className="text-sm text-gray-300 mt-2">{overview}</p>

      {/* Genres */}
      {genres.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-6">
          {genres.map((genre, index) => (
            <p
              key={index}
              className="bg-zinc-900 text-gray-200 text-sm font-semibold px-4 py-2 rounded-full"
            >
              {genre}
            </p>
          ))}
        </div>
      )}

      {/* Cast */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Actors</h3>
        {cast.length === 0 ? (
          <p className="text-sm text-gray-400">No cast data available.</p>
        ) : (
          <div className="space-y-4">
            {cast.map((member) => (
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
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
