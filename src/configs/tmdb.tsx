const API_KEY = import.meta.env.VITE_API_KEY;
const API_BASE = import.meta.env.VITE_API_BASE;

export const TMDB = {
  API_KEY,
  BASE_URL: API_BASE,

  // Discover
  get discoverMovies() {
    return `${API_BASE}/discover/movie?api_key=${API_KEY}&include_adult=false`;
  },

  getsearchDiscoverMovies(query: string) {
    return `${API_BASE}/discover/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&include_adult=false`;
  },

  get discoverShows() {
    return `${API_BASE}/discover/tv?api_key=${API_KEY}&include_adult=false`;
  },

  getsearchDiscoverShows(query: string) {
    return `${API_BASE}/discover/tv?api_key=${API_KEY}&query=${encodeURIComponent(query)}&include_adult=false`;
  },

  // Trending
  get trendingMovies() {
    return `${API_BASE}/trending/movie/week?api_key=${API_KEY}&include_adult=false`;
  },

  get trendingShows() {
    return `${API_BASE}/trending/tv/week?api_key=${API_KEY}&include_adult=false`;
  },

  // Search
  getSearchMovies(query: string) {
    return `${API_BASE}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&include_adult=false`;
  },

  getSearchShows(query: string) {
    return `${API_BASE}/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(query)}&include_adult=false`;
  },

  getSearchMoviesAndShows(query: string) {
    return `${API_BASE}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&include_adult=false`;
  },

  // Movie Images (logos, backdrops, etc)
  getMovieImages(id: string | number) {
    return `${API_BASE}/movie/${id}/images?api_key=${API_KEY}&include_image_language=en,null`;
  },

  getShowImages(id: string | number) {
    return `${API_BASE}/tv/${id}/images?api_key=${API_KEY}&include_image_language=en,null`;
  },

  // Movie Details
  getMovieDetails(id: string | number) {
    return `${API_BASE}/movie/${id}?api_key=${API_KEY}&append_to_response=credits,videos`;
  },

  getShowDetails(id: string | number) {
    return `${API_BASE}/tv/${id}?api_key=${API_KEY}&append_to_response=credits,videos`;
  },

  // Movie Recommendations
  getRecommendedMovies(id: string | number) {
    return `${API_BASE}/movie/${id}/recommendations?api_key=${API_KEY}`;
  },

  getRecommendedShows(id: string | number) {
    return `${API_BASE}/tv/${id}/recommendations?api_key=${API_KEY}`;
  },

  getShowSeasonDetails(id: string | number, season: number) {
    return `${API_BASE}/tv/${id}/season/${season}?api_key=${API_KEY}`;
  }
};
