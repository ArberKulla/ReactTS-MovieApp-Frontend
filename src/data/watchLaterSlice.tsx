import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Define the shape of a Movie object
interface Movie {
  id: number;
  title: string;
  // Add any other fields your Movie object uses
}

// Define the shape of the state
interface WatchLaterState {
  watchLaterMovies: Movie[];
}

// Initial state
const initialState: WatchLaterState = {
  watchLaterMovies: [],
};

const watchLaterSlice = createSlice({
  name: 'watch-later',
  initialState,
  reducers: {
    addToWatchLater: (state, action: PayloadAction<Movie>) => {
      state.watchLaterMovies = [action.payload, ...state.watchLaterMovies];
    },
    removeFromWatchLater: (state, action: PayloadAction<{ id: number }>) => {
      state.watchLaterMovies = state.watchLaterMovies.filter(
        (movie) => movie.id !== action.payload.id
      );
    },
    removeAllWatchLater: (state) => {
      state.watchLaterMovies = [];
    },
  },
});

// Export actions
export const {
  addToWatchLater,
  removeFromWatchLater,
  removeAllWatchLater,
} = watchLaterSlice.actions;

export default watchLaterSlice;
