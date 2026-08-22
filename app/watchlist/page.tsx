'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// 🔗 YOUR DIRECT LINK - Replace with your actual link
const YOUR_DIRECT_LINK = 'https://guyprior.com/ja5sjb490?key=e1fab3e807877144ce91bd0eda6951bc';

interface WatchlistItem {
  id: string;
  movie_id: number;
  status: string;
  added_at: string;
  movies: {
    id: number;
    title: string;
    poster_path: string;
    release_date: string;
    vote_average: number;
  };
}

export default function WatchlistPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
      return;
    }

    if (user) {
      loadWatchlist(user.id);
    }
  }, [user, loading]);

  const loadWatchlist = async (userId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('watchlist')
        .select(`
          id,
          movie_id,
          status,
          added_at,
          movies:movie_id (
            id,
            title,
            poster_path,
            release_date,
            vote_average
          )
        `)
        .eq('user_id', userId)
        .order('added_at', { ascending: false });

      if (error) throw error;
      setWatchlist(data || []);
    } catch (error) {
      console.error('Error loading watchlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWatchlist = async (id: string) => {
    if (!confirm('Remove from watchlist?')) return;

    try {
      const { error } = await supabase
        .from('watchlist')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setWatchlist(watchlist.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      alert('Error removing from watchlist. Please try again.');
    }
  };

  const handleWatchNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(YOUR_DIRECT_LINK, '_blank');
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-gold text-xl animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-serif text-gold">📋 My Watchlist</h1>
          <span className="text-text-secondary">{watchlist.length} movies</span>
        </div>

        {watchlist.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-text-secondary mb-4">Your watchlist is empty</p>
            <Link href="/">
              <button className="px-6 py-3 bg-gold text-black rounded-lg font-semibold hover:bg-gold/80 transition">
                Browse Movies
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {watchlist.map((item) => {
              const movie = item.movies;
              const posterUrl = movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : '/placeholder-poster.jpg';

              return (
                <div key={item.id} className="group relative">
                  <Link href={`/movie/${movie.id}`}>
                    <div className="bg-surface rounded-xl overflow-hidden border border-gray-800/50 hover:border-gold/30 transition">
                      <div className="relative aspect-[2/3]">
                        <Image
                          src={posterUrl}
                          alt={movie.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, 33vw"
                        />
                        
                        {/* Remove button */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            removeFromWatchlist(item.id);
                          }}
                          className="absolute top-3 right-3 bg-black/80 backdrop-blur p-2 rounded-full hover:bg-crimson transition z-10"
                        >
                          ❌
                        </button>

                        {/* Watch Now button overlay on hover */}
                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 p-4">
                          <button
                            onClick={handleWatchNow}
                            className="px-6 py-2 bg-gold text-black rounded-lg font-bold hover:bg-gold/80 transition transform hover:scale-105 text-sm"
                          >
                            ▶️ Watch Now
                          </button>
                          <span className="text-text-secondary text-xs">View Details →</span>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-semibold truncate">{movie.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-text-secondary">
                              <span>{movie.release_date?.split('-')[0] || 'TBA'}</span>
                              {movie.vote_average > 0 && (
                                <>
                                  <span>•</span>
                                  <span>⭐ {movie.vote_average.toFixed(1)}</span>
                                </>
                              )}
                            </div>
                          </div>
                          {/* Small Watch button */}
                          <button
                            onClick={handleWatchNow}
                            className="flex-shrink-0 px-3 py-1 bg-gold/20 text-gold text-xs rounded-full hover:bg-gold/40 transition font-medium"
                          >
                            Watch
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
