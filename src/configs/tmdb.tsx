const API_KEY = import.meta.env.VITE_API_KEY;
const API_BASE = import.meta.env.VITE_API_BASE;

export const TMDB = {
  API_KEY,
  BASE_URL: API_BASE,
  get discoverMovies() {
    return `${API_BASE}/discover/movie?api_key=${API_KEY}`;
  },
  getSearchMovies(query: string) {
    return `${API_BASE}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`;
  },
  getMovieDetails(id: string | number) {
    return `${API_BASE}/movie/${id}?api_key=${API_KEY}&append_to_response=videos`;
  },
};
