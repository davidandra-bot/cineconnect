'use client';

import { useEffect, useState } from 'react';
import { getPopularMovies, getTrendingMovies, getTopRatedMovies, getUpcomingMovies, Movie } from '@/lib/tmdb';
import MovieCard from '@/components/MovieCard';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function Home() {
  const { user, loading } = useAuth();
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadMovies() {
      try {
        const [popular, trending, topRated, upcoming] = await Promise.all([
          getPopularMovies(1),
          getTrendingMovies('day'),
          getTopRatedMovies(),
          getUpcomingMovies(),
        ]);
        setPopularMovies(popular.slice(0, 10));
        setTrendingMovies(trending.slice(0, 10));
        setTopRatedMovies(topRated.slice(0, 10));
        setUpcomingMovies(upcoming.slice(0, 10));
      } catch (error) {
        console.error('Error loading movies:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadMovies();
  }, []);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-gold text-xl animate-pulse">Loading movies...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative h-[50vh] flex items-center justify-center bg-gradient-to-b from-surface-elevated to-black">
        <div className="text-center px-4">
          <h1 className="text-4xl md:text-6xl font-serif text-gold gold-glow mb-4">
            CineConnect
          </h1>
          <p className="text-xl text-text-secondary mb-8">
            Discover, rate, and share movies with friends 🎬
          </p>
          {!user ? (
            <Link href="/auth">
              <button className="px-8 py-3 bg-gold text-black rounded-lg font-semibold hover:bg-gold/80 transition">
                Get Started
              </button>
            </Link>
          ) : (
            <p className="text-white">Welcome back! 🎉</p>
          )}
        </div>
      </div>

      {/* Trending Movies */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-serif text-gold mb-6">🔥 Trending Today</h2>
        {trendingMovies.length === 0 ? (
          <p className="text-text-secondary">No trending movies found. Check your TMDB API key.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {trendingMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>

      {/* Popular Movies */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-serif text-gold mb-6">⭐ Popular Movies</h2>
        {popularMovies.length === 0 ? (
          <p className="text-text-secondary">No popular movies found. Check your TMDB API key.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {popularMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>

      {/* Top Rated Movies */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-serif text-gold mb-6">🌟 Top Rated Movies</h2>
        {topRatedMovies.length === 0 ? (
          <p className="text-text-secondary">No top rated movies found.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {topRatedMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Movies */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-serif text-gold mb-6">📅 Upcoming Movies</h2>
        {upcomingMovies.length === 0 ? (
          <p className="text-text-secondary">No upcoming movies found.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {upcomingMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>

      {/* Load More Button */}
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <Link href="/movies">
          <button className="px-8 py-3 bg-surface-elevated border border-gold/30 text-gold rounded-lg font-semibold hover:bg-gold/10 transition">
            Browse All Movies →
          </button>
        </Link>
      </div>
    </main>
  );
}
