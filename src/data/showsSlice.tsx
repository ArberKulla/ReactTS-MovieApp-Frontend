import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface MoviesApiResponse {
  results: any[];
}

interface ShowsState {
  shows: MoviesApiResponse | null;
  fetchStatus: 'idle' | 'loading' | 'success' | 'error';
}

const initialState: ShowsState = {
  shows: null,
  fetchStatus: 'idle',
};

export const fetchShows = createAsyncThunk<MoviesApiResponse, string, { rejectValue: string }>(
  'fetch-shows',
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
const showsSlice = createSlice({
  name: 'shows',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchShows.fulfilled, (state, action) => {
        const params = new URLSearchParams(action.meta.arg.split('?')[1] || '');
        const page = params.get('page');

        if (page === '1' || page === null) {
          state.shows = action.payload;
        } else if (state.shows) {
          // Merge results for pagination
          state.shows.results = [...state.shows.results, ...action.payload.results];
        }

        state.fetchStatus = 'success';
      })
      .addCase(fetchShows.pending, (state) => {
        state.fetchStatus = 'loading';
      })
      .addCase(fetchShows.rejected, (state) => {
        state.fetchStatus = 'error';
      });
  },
});

export default showsSlice;
