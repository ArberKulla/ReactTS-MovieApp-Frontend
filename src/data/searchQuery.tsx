import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface MoviesApiResponse {
  results: any[];
}

interface MoviesState {
  searchResults: MoviesApiResponse | null;
  fetchStatus: 'idle' | 'loading' | 'success' | 'error';
}

const initialState: MoviesState = {
  searchResults: null,
  fetchStatus: 'idle',
};

export const searchWithQuery = createAsyncThunk<MoviesApiResponse, string, { rejectValue: string }>(
  'fetch-all',
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
const querySlice = createSlice({
  name: 'movies-shows',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchWithQuery.fulfilled, (state, action) => {
        const params = new URLSearchParams(action.meta.arg.split('?')[1] || '');
        const page = params.get('page');

        if (page === '1' || page === null) {
          state.searchResults = action.payload;
        } else if (state.searchResults) {
          // Merge results for pagination
          state.searchResults.results = [...state.searchResults.results, ...action.payload.results];
        }

        state.fetchStatus = 'success';
      })
      .addCase(searchWithQuery.pending, (state) => {
        state.fetchStatus = 'loading';
      })
      .addCase(searchWithQuery.rejected, (state) => {
        state.fetchStatus = 'error';
      });
  },
});

export default querySlice;
