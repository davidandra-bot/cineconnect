'use client';

import WatchlistButton from '@/components/WatchlistButton';
import { useEffect, useState } from 'react';
import { getMovieDetails, getMovieTrailer } from '@/lib/tmdb';
import Image from 'next/image';
import { notFound, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import RatingStars from '@/components/RatingStars';

interface MoviePageProps {
  params: {
    id: string;
  };
}

interface Rating {
  id: string;
  user_id: string;
  movie_id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
  user: {
    username: string;
    avatar_url: string | null;
  };
}

export default function MoviePage({ params }: MoviePageProps) {
  const { user } = useAuth();
  const router = useRouter();
  const movieId = parseInt(params.id);

  const [movie, setMovie] = useState<any>(null);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [userRating, setUserRating] = useState<number>(0);
  const [userReview, setUserReview] = useState('');
  const [existingRating, setExistingRating] = useState<any>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalRatings, setTotalRatings] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch movie details
        const movieData = await getMovieDetails(movieId);
        if (!movieData || !movieData.id) {
          notFound();
        }
        setMovie(movieData);

        // Fetch trailer
        const trailer = await getMovieTrailer(movieId);
        setTrailerKey(trailer);

        // Fetch ratings
        const { data: ratingsData, error: ratingsError } = await supabase
          .from('ratings')
          .select(`
            *,
            user:user_id(username, avatar_url)
          `)
          .eq('movie_id', movieId)
          .order('created_at', { ascending: false });

        if (!ratingsError && ratingsData) {
          setRatings(ratingsData);

          // Calculate average
          const total = ratingsData.length;
          const sum = ratingsData.reduce((acc: number, r: any) => acc + r.rating, 0);
          setTotalRatings(total);
          setAverageRating(total > 0 ? sum / total : 0);

          // Check if user has rated
          if (user) {
            const userRating = ratingsData.find((r: any) => r.user_id === user.id);
            if (userRating) {
              setExistingRating(userRating);
              setUserRating(userRating.rating);
              setUserReview(userRating.review_text || '');
            }
          }
        }
      } catch (error) {
        console.error('Error loading movie data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [movieId, user]);

  const handleSubmitRating = async () => {
    if (!user) {
      router.push('/auth');
      return;
    }

    if (userRating === 0) {
      alert('Please select a rating');
      return;
    }

    setSubmitting(true);

    try {
      if (existingRating) {
        // Update existing rating
        const { error } = await supabase
          .from('ratings')
          .update({
            rating: userRating,
            review_text: userReview || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingRating.id);

        if (error) throw error;
      } else {
        // Insert new rating
        const { error } = await supabase
          .from('ratings')
          .insert({
            user_id: user.id,
            movie_id: movieId,
            rating: userRating,
            review_text: userReview || null,
          });

        if (error) throw error;
      }

      // Refresh page
      window.location.reload();
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Error saving your rating. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-gold text-xl animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!movie) {
    return notFound();
  }

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/placeholder-poster.jpg';

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;

  return (
    <div className="min-h-screen bg-black">
      {/* Backdrop */}
      {backdropUrl && (
        <div className="relative h-[40vh] w-full">
          <Image
            src={backdropUrl}
            alt={movie.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0 w-48 md:w-64">
            <Image
              src={posterUrl}
              alt={movie.title}
              width={256}
              height={384}
              className="rounded-xl shadow-2xl shadow-gold/20 border-2 border-gold/30"
            />
          </div>

          {/* Info */}
          <div className="flex-1 pt-8">
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-white">
              {movie.title}
              <span className="text-text-muted font-light ml-3">
                {movie.release_date?.split('-')[0] || 'TBA'}
              </span>
            </h1>

            {movie.tagline && (
              <p className="text-text-secondary italic mt-2 text-lg">"{movie.tagline}"</p>
            )}

            {/* Ratings Summary */}
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-gold">
                  {averageRating > 0 ? averageRating.toFixed(1) : '?'}
                </span>
                <span className="text-text-secondary">/ 10</span>
              </div>
              <span className="text-text-muted">•</span>
              <span className="text-text-secondary">{totalRatings} ratings</span>
            </div>

            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {movie.genres.map((genre: any) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-surface-elevated border border-gray-700 rounded-full text-sm text-text-secondary"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            <p className="mt-6 text-text-secondary leading-relaxed">{movie.overview}</p>

            {/* Rating Form */}
            <div className="mt-8 p-6 bg-surface-elevated rounded-xl border border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-4">
                {user ? 'Your Rating' : 'Sign in to rate this movie'}
              </h3>

              {!user ? (
                <button
                  onClick={() => router.push('/auth')}
                  className="px-6 py-2 bg-gold text-black rounded-lg font-semibold hover:bg-gold/80 transition"
                >
                  Sign In to Rate
                </button>
              ) : (
                <>
                  <div className="mb-4">
                    <RatingStars
                      initialRating={userRating}
                      onRating={(rating) => setUserRating(rating)}
                      size="lg"
                    />
                  </div>

                  <textarea
                    value={userReview}
                    onChange={(e) => setUserReview(e.target.value)}
                    placeholder="Write a review (optional)..."
                    className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:border-gold focus:outline-none transition resize-none"
                    rows={3}
                  />

                  <button
                    onClick={handleSubmitRating}
                    disabled={submitting || userRating === 0}
                    className="mt-4 px-6 py-2 bg-gold text-black rounded-lg font-semibold hover:bg-gold/80 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Saving...' : existingRating ? 'Update Rating' : 'Submit Rating'}
                  </button>

                  {existingRating && (
                    <p className="mt-2 text-sm text-text-muted">
                      You rated this movie {existingRating.rating}/10
                    </p>
                  )}
                </>
              )}
            </div>

            {trailerKey && (
              <div className="mt-6">
                <a
                  href={`https://www.youtube.com/watch?v=${trailerKey}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-crimson text-white rounded-lg hover:bg-crimson/80 transition"
                >
                  ▶ Watch Trailer
                </a>
              </div>
            )}

            {/* Add Watchlist Button */}
            <div className="mt-4">
              <WatchlistButton movieId={movieId} movieTitle={movie.title} />
            </div>

            {/* User Reviews Section */}
            <div className="mt-12 pb-12">
              <h2 className="text-2xl font-serif text-gold mb-6">User Reviews</h2>

              {ratings.length === 0 ? (
                <p className="text-text-muted">No reviews yet. Be the first to rate!</p>
              ) : (
                <div className="space-y-4">
                  {ratings.map((rating) => (
                    <div
                      key={rating.id}
                      className="p-4 bg-surface-elevated rounded-xl border border-gray-800"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                            {rating.user?.avatar_url ? (
                              <Image
                                src={rating.user.avatar_url}
                                alt={rating.user.username}
                                width={32}
                                height={32}
                                className="rounded-full"
                              />
                            ) : (
                              <span className="text-gold text-sm font-bold">
                                {rating.user?.username?.[0]?.toUpperCase() || '?'}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="text-white font-medium">
                              {rating.user?.username || 'Anonymous'}
                            </p>
                            <p className="text-text-muted text-sm">
                              {new Date(rating.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gold font-bold text-lg">
                            {rating.rating.toFixed(1)}
                          </span>
                          <span className="text-text-muted text-sm">/ 10</span>
                        </div>
                      </div>
                      {rating.review_text && (
                        <p className="mt-3 text-text-secondary">{rating.review_text}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
