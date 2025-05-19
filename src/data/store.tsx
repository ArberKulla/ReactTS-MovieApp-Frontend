import { configureStore } from "@reduxjs/toolkit";
import moviesSlice from "./moviesSlice";
import watchLaterSlice from "./watchLaterSlice";
import showSlice from "./showsSlice";
import moviesRecommendedSlice from "./moviesRecommendedSlice";
import season from "./seasonSlice";

export const store = configureStore({
  reducer: {
    movies: moviesSlice.reducer,
    recommendedMovies: moviesRecommendedSlice.reducer,
    season: season.reducer,
    watchLater: watchLaterSlice.reducer,
    shows: showSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
