import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface MoviesApiResponse {
  results: any[];
}

interface MoviesState {
  recommendedMovies: MoviesApiResponse;
  fetchStatus: 'idle' | 'loading' | 'success' | 'error';
}

const initialState: MoviesState = {
  recommendedMovies: { results: [] },
  fetchStatus: 'idle',
};

export const fetchRecommendedMovies = createAsyncThunk<MoviesApiResponse, string, { rejectValue: string }>(
  'fetch-recommended-movies',
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
const moviesRecommendedSlice = createSlice({
  name: 'recommendedMovies',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecommendedMovies.fulfilled, (state, action) => {
        const params = new URLSearchParams(action.meta.arg.split('?')[1] || '');
        const page = params.get('page');

        if (page === '1' || page === null) {
          state.recommendedMovies = action.payload;
        } else if (state.recommendedMovies) {
          // Merge results for pagination
          state.recommendedMovies.results = [...state.recommendedMovies.results, ...action.payload.results];
        }

        state.fetchStatus = 'success';
      })
      .addCase(fetchRecommendedMovies.pending, (state) => {
        state.fetchStatus = 'loading';
      })
      .addCase(fetchRecommendedMovies.rejected, (state) => {
        state.fetchStatus = 'error';
      });
  },
});

export default moviesRecommendedSlice;
