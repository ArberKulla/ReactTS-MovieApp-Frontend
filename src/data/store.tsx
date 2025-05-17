import { configureStore } from "@reduxjs/toolkit";
import moviesSlice from "./moviesSlice";
import watchLaterSlice from "./watchLaterSlice";

export const store = configureStore({
  reducer: {
    movies: moviesSlice.reducer,
    watchLater: watchLaterSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
