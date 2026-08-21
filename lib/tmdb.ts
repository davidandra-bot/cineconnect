const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY!;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  runtime?: number;
}

// Get popular movies
export async function getPopularMovies(page: number = 1) {
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`
  );
  const data = await response.json();
  return data.results || [];
}

// Get trending movies
export async function getTrendingMovies(timeWindow: 'day' | 'week' = 'day') {
  const response = await fetch(
    `${TMDB_BASE_URL}/trending/movie/${timeWindow}?api_key=${TMDB_API_KEY}`
  );
  const data = await response.json();
  return data.results || [];
}

// Get movie details by ID
export async function getMovieDetails(movieId: number) {
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos`
  );
  const data = await response.json();
  return data;
}

// Get movie trailer
export async function getMovieTrailer(movieId: number) {
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}`
  );
  const data = await response.json();
  const trailer = data.results?.find(
    (video: any) => video.type === 'Trailer' && video.site === 'YouTube'
  );
  return trailer ? trailer.key : null;
}
