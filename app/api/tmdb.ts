import Constants from 'expo-constants';
const TMDB_API_KEY = Constants?.expoConfig?.extra?.TMDB_API_KEY ?? '';
const BASE_URL = 'https://api.themoviedb.org/3';

export const fetchTrendingMovies = async () => {
  const res = await fetch(`${BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}`);
  return res.json();
};

export const fetchMoviesByGenre = async (genreId: number) => {
  const res = await fetch(`${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}`);
  return await res.json();
};

export const fetchMovieDetails = async (movieId: number) => {
  const res = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}`);
  return await res.json();
};

export const fetchMoviesBySearch = async (query: string) => {
  try {
    const res = await fetch(`${BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Search error:', err);
    return { results: [] };
  }
};