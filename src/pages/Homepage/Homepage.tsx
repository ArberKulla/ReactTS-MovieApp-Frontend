import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../hooks/dispatch";
import { fetchMovies } from "../../data/moviesSlice";
import { fetchShows } from "../../data/showsSlice";
import type { FunctionComponent } from "react";
import type { RootState } from "../../data/store";
import { TMDB } from "../../configs/tmdb";
import MoviesSlider from "../../modules/MovieSlider/MovieSlider";
import HeroSlider from "./HeroSlider";

const Homepage: FunctionComponent = () => {
  const dispatch = useAppDispatch();
  const { movies } = useSelector((state: RootState) => state.movies);
  const { shows } = useSelector((state: RootState) => state.shows);

  const MOVIEAPIURL = TMDB.trendingMovies;
  const SHOWAPIURL = TMDB.trendingShows;

  useEffect(() => {
    dispatch(fetchMovies(MOVIEAPIURL));
    dispatch(fetchShows(SHOWAPIURL));
  }, [dispatch]);

  return (
    <div className="space-y-10">
      {/* HeroSlider at the top */}
      <HeroSlider
        movies={[...(movies?.results || []), ...(shows?.results || [])].slice(0, 5)}
      />

      {/* Trending Movies */}
      <div>
        <MoviesSlider movies={movies?.results || []} title="Trending Movies" />
      </div>

      {/* Trending Shows */}
      <div>
        <MoviesSlider movies={shows?.results || []} title="Trending Shows" />
      </div>
    </div>
  );
};

export default Homepage;
