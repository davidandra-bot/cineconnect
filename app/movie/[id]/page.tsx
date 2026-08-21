'use client';

import { useEffect, useState } from 'react';
import { getPopularMovies, Movie } from '@/lib/tmdb';
import MovieCard from '@/components/MovieCard';

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const loadMovies = async (pageNum: number) => {
    setLoading(true);
    try {
      const newMovies = await getPopularMovies(pageNum);
      if (newMovies.length === 0) {
        setHasMore(false);
      } else {
        setMovies(prev => [...prev, ...newMovies]);
        setPage(pageNum);
      }
    } catch (error) {
      console.error('Error loading movies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies(1);
  }, []);

  return (
    <div className="min-h-screen bg-black px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-serif text-gold mb-8">All Movies</h1>
        
        {movies.length === 0 && !loading ? (
          <p className="text-text-secondary">No movies found.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}

        {loading && (
          <div className="text-center py-8 text-gold">Loading more movies...</div>
        )}

        {hasMore && !loading && (
          <div className="text-center py-8">
            <button
              onClick={() => loadMovies(page + 1)}
              className="px-8 py-3 bg-surface-elevated border border-gold/30 text-gold rounded-lg font-semibold hover:bg-gold/10 transition"
            >
              Load More Movies
            </button>
          </div>
        )}

        {!hasMore && (
          <p className="text-center text-text-muted py-8">You've seen all movies!</p>
        )}
      </div>
    </div>
  );
}
