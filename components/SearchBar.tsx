'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { searchMovies, Movie } from '@/lib/tmdb';
import Image from 'next/image';
import Link from 'next/link';

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (query.length >= 2) {
        setLoading(true);
        try {
          const results = await searchMovies(query);
          setResults(results.slice(0, 6));
          setIsOpen(true);
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setIsOpen(false);
    }
  };

  return (
    <div ref={searchRef} className="relative flex-1 max-w-xl">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder="🔍 Search movies..."
          className="w-full px-4 py-2 bg-surface-elevated border border-gray-700 rounded-lg text-white placeholder-text-muted focus:border-gold focus:outline-none transition"
        />
        {loading && (
          <div className="absolute right-3 top-2.5">
            <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </form>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-surface-elevated border border-gray-700 rounded-lg shadow-2xl max-h-96 overflow-y-auto z-50">
          {results.map((movie) => {
            const posterUrl = movie.poster_path
              ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
              : null;
            const year = movie.release_date?.split('-')[0] || 'TBA';
            const rating = movie.vote_average ? movie.vote_average.toFixed(1) : '0.0';

            return (
              <Link
                key={movie.id}
                href={`/movie/${movie.id}`}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-3 hover:bg-white/5 transition border-b border-gray-800 last:border-0"
              >
                {posterUrl ? (
                  <Image
                    src={posterUrl}
                    alt={movie.title}
                    width={40}
                    height={60}
                    className="rounded object-cover"
                  />
                ) : (
                  <div className="w-10 h-15 bg-surface-elevated rounded flex items-center justify-center text-2xl">
                    🎬
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-white font-medium">{movie.title}</p>
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <span>{year}</span>
                    <span>•</span>
                    <span>⭐ {rating}</span>
                  </div>
                </div>
              </Link>
            );
          })}
          <Link
            href={`/search?q=${encodeURIComponent(query)}`}
            onClick={() => setIsOpen(false)}
            className="block p-3 text-center text-gold hover:bg-white/5 transition border-t border-gray-800"
          >
            See all results →
          </Link>
        </div>
      )}

      {isOpen && query.length >= 2 && results.length === 0 && !loading && (
        <div className="absolute top-full mt-2 w-full bg-surface-elevated border border-gray-700 rounded-lg p-4 text-center text-text-muted z-50">
          No movies found for "{query}"
        </div>
      )}
    </div>
  );
}
