'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface WatchlistButtonProps {
  movieId: number;
  movieTitle: string;
}

export default function WatchlistButton({ movieId, movieTitle }: WatchlistButtonProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [inWatchlist, setInWatchlist] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      checkWatchlist();
    }
  }, [user, movieId]);

  const checkWatchlist = async () => {
    const { data, error } = await supabase
      .from('watchlist')
      .select('id')
      .eq('user_id', user.id)
      .eq('movie_id', movieId)
      .single();

    if (!error && data) {
      setInWatchlist(true);
    }
  };

  const toggleWatchlist = async () => {
    if (!user) {
      router.push('/auth');
      return;
    }

    setLoading(true);

    try {
      if (inWatchlist) {
        // Remove from watchlist
        const { error } = await supabase
          .from('watchlist')
          .delete()
          .eq('user_id', user.id)
          .eq('movie_id', movieId);

        if (error) throw error;
        setInWatchlist(false);
      } else {
        // Add to watchlist
        const { error } = await supabase
          .from('watchlist')
          .insert({
            user_id: user.id,
            movie_id: movieId,
            status: 'planning',
          });

        if (error) throw error;
        setInWatchlist(true);
      }
    } catch (error) {
      console.error('Error updating watchlist:', error);
      alert('Error updating watchlist. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleWatchlist}
      disabled={loading}
      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
        inWatchlist
          ? 'bg-gold text-black hover:bg-gold/80'
          : 'bg-surface-elevated border border-gray-700 text-white hover:bg-white/10'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {loading ? (
        'Loading...'
      ) : inWatchlist ? (
        <>
          ✅ In Watchlist
        </>
      ) : (
        <>
          📋 Add to Watchlist
        </>
      )}
    </button>
  );
}
