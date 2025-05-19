import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface SearchItem {
  media_type: 'movie' | 'tv' | 'person';
  [key: string]: any;
}

interface MoviesApiResponse {
  results: SearchItem[];
}

interface MoviesState {
  searchResults: SearchItem[]; // Unified movies + shows
  fetchStatus: 'idle' | 'loading' | 'success' | 'error';
}

const initialState: MoviesState = {
  searchResults: [],
  fetchStatus: 'idle',
};

export const searchWithQuery = createAsyncThunk<MoviesApiResponse, string, { rejectValue: string }>(
  'search/fetchWithQuery',
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

const querySlice = createSlice({
  name: 'search',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchWithQuery.pending, (state) => {
        state.fetchStatus = 'loading';
      })
      .addCase(searchWithQuery.fulfilled, (state, action) => {
        const results = action.payload.results || [];

        // Filter only movies and tv (ignore persons)
        const filtered = results.filter(item =>
          item.media_type === 'movie' || item.media_type === 'tv'
        );

        const params = new URLSearchParams(action.meta.arg.split('?')[1] || '');
        const page = params.get('page');

        if (page === '1' || page === null) {
          state.searchResults = filtered;
        } else {
          state.searchResults = [...state.searchResults, ...filtered];
        }

        state.fetchStatus = 'success';
      })
      .addCase(searchWithQuery.rejected, (state) => {
        state.fetchStatus = 'error';
      });
  },
});

export default querySlice;
