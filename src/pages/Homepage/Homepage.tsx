import { TbError404 } from "react-icons/tb";
import { fetchMovies } from "../../data/moviesSlice";
import { useAppDispatch } from "../../hooks/dispatch";
import type { FunctionComponent } from "react";
import { Children, useEffect } from "react";
import { useSelector } from 'react-redux'
import type { RootState } from '../../data/store';
import { TMDB } from "../../configs/tmdb";
import MoviesSlider from "../../modules/MovieSlider/MovieSlider";




const Homepage: FunctionComponent = () => {
    const dispatch = useAppDispatch();
    const state = useSelector((state: RootState) => state)
    const { movies } = state.movies
    const APIURL = TMDB.discoverMovies;

  useEffect(() => {
    dispatch(fetchMovies(APIURL));
  }, [dispatch]);

  return (
    <div>
    <MoviesSlider movies={movies?.results || []}/>
    </div>
  );
};

export default Homepage;
