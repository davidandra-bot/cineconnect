'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { searchMovies, Movie } from '@/lib/tmdb';
import MovieCard from '@/components/MovieCard';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResults() {
      if (!query) {
        setMovies([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const results = await searchMovies(query);
        setMovies(results);
      } catch (error) {
        console.error('Search error:', error);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    }

    loadResults();
  }, [query]);

  return (
    <div className="min-h-screen bg-black px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-serif text-gold mb-2">
          Results for "{query}"
        </h1>
        <p className="text-text-secondary mb-8">
          Found {movies.length} movies
        </p>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-gold text-xl animate-pulse">Searching...</div>
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-text-secondary mb-4">No movies found</p>
            <p className="text-text-muted">Try searching with different keywords</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-gold text-xl animate-pulse">Loading...</div>
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
}
