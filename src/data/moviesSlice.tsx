import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface MoviesApiResponse {
  results: any[];
}

interface MoviesState {
  movies: MoviesApiResponse | null;
  fetchStatus: 'idle' | 'loading' | 'success' | 'error';
}

const initialState: MoviesState = {
  movies: null,
  fetchStatus: 'idle',
};

export const fetchMovies = createAsyncThunk<MoviesApiResponse, string, { rejectValue: string }>(
  'fetch-movies',
  async (apiUrl, { rejectWithValue }) => {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data: MoviesApiResponse = await response.json();
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Slice
const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.fulfilled, (state, action) => {
        const params = new URLSearchParams(action.meta.arg.split('?')[1] || '');
        const page = params.get('page');

        if (page === '1' || page === null) {
          state.movies = action.payload;
        } else if (state.movies) {
          // Merge results for pagination
          state.movies.results = [...state.movies.results, ...action.payload.results];
        }

        state.fetchStatus = 'success';
      })
      .addCase(fetchMovies.pending, (state) => {
        state.fetchStatus = 'loading';
      })
      .addCase(fetchMovies.rejected, (state) => {
        state.fetchStatus = 'error';
      });
  },
});

export default moviesSlice;
