import { TbError404 } from "react-icons/tb";
import { fetchMovies } from "../../data/moviesSlice";
import { fetchShows } from "../../data/showsSlice";
import { useAppDispatch } from "../../hooks/dispatch";
import type { FunctionComponent } from "react";
import { Children, use, useEffect } from "react";
import { useSelector } from 'react-redux'
import type { RootState } from '../../data/store';
import { TMDB } from "../../configs/tmdb";
import MoviesSlider from "../../modules/MovieSlider/MovieSlider";
import type { title } from "process";




const Homepage: FunctionComponent = () => {
    const dispatch = useAppDispatch();
    const state = useSelector((state: RootState) => state)
    const { movies } = state.movies
    const { shows } = state.shows
    const MOVIEAPIURL = TMDB.trendingMovies;
    const SHOWAPIURL = TMDB.trendingShows;

  useEffect(() => {
    dispatch(fetchMovies(MOVIEAPIURL));
    dispatch(fetchShows(SHOWAPIURL));
  }, [dispatch]);

  return (
    <div>
      <div>
        <MoviesSlider 
        movies={movies?.results || []}
        title="Trending Movies"/>
      </div>

      <div>
        <MoviesSlider 
        movies={shows?.results || []}
        title="Trending Shows"/>
      </div>
    </div>

  );
};

export default Homepage;
