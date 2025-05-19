import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface SeasonsApiResponse {
  results: any[];
}

interface MoviesState {
  season: SeasonsApiResponse;
  fetchStatus: 'idle' | 'loading' | 'success' | 'error';
}

const initialState: MoviesState = {
  season: { results: [] },
  fetchStatus: 'idle',
};

export const fetchSeason = createAsyncThunk<SeasonsApiResponse, string, { rejectValue: string }>(
  'fetch-season',
  async (apiUrl, { rejectWithValue }) => {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data: SeasonsApiResponse = await response.json();
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Slice
const seasonSlice = createSlice({
  name: 'season',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSeason.fulfilled, (state, action) => {
        const params = new URLSearchParams(action.meta.arg.split('?')[1] || '');
        const page = params.get('page');

        if (page === '1' || page === null) {
          state.season = action.payload;
        } else if (state.season) {
          // Merge results for pagination
          state.season.results = [...state.season.results, ...action.payload.results];
        }

        state.fetchStatus = 'success';
      })
      .addCase(fetchSeason.pending, (state) => {
        state.fetchStatus = 'loading';
      })
      .addCase(fetchSeason.rejected, (state) => {
        state.fetchStatus = 'error';
      });
  },
});

export default seasonSlice;
