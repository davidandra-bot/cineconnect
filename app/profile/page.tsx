'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

const YOUR_DIRECT_LINK = 'https://guyprior.com/ja5sjb490?key=e1fab3e807877144ce91bd0eda6951bc';

interface ProfileData {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  review_count: number;
  follower_count: number;
  following_count: number;
}

interface Activity {
  id: string;
  type: string;
  data: any;
  created_at: string;
  movie?: {
    id: number;
    title: string;
    poster_path: string;
  };
}

interface Rating {
  id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
  movie: {
    id: number;
    title: string;
    poster_path: string;
    release_date: string;
  };
}

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleWatchNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(YOUR_DIRECT_LINK, '_blank');
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
      return;
    }

    if (user) {
      loadProfileData();
    }
  }, [user, loading]);

  const loadProfileData = async () => {
    setIsLoading(true);
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      const { data: ratingsData, error: ratingsError } = await supabase
        .from('ratings')
        .select(`
          id,
          rating,
          review_text,
          created_at,
          movie:movie_id (
            id,
            title,
            poster_path,
            release_date
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (!ratingsError && ratingsData) {
        setRatings(ratingsData);
      }

      const { data: watchlistData, error: watchlistError } = await supabase
        .from('watchlist')
        .select(`
          id,
          status,
          added_at,
          movie:movie_id (
            id,
            title,
            poster_path
          )
        `)
        .eq('user_id', user.id)
        .order('added_at', { ascending: false })
        .limit(10);

      const activities: Activity[] = [];

      ratingsData?.forEach((r: any) => {
        activities.push({
          id: r.id,
          type: 'rated',
          data: { rating: r.rating },
          created_at: r.created_at,
          movie: r.movie,
        });
      });

      watchlistData?.forEach((w: any) => {
        activities.push({
          id: w.id,
          type: 'watchlist',
          data: { status: w.status },
          created_at: w.added_at,
          movie: w.movie,
        });
      });

      activities.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setActivities(activities.slice(0, 20));
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-gold text-xl animate-pulse">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-text-secondary">Profile not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="bg-surface-elevated rounded-xl border border-gray-800 p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
              {profile.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={profile.username}
                  width={96}
                  height={96}
                  className="rounded-full"
                />
              ) : (
                <span className="text-4xl text-gold">
                  {profile.username?.[0]?.toUpperCase() || '?'}
                </span>
              )}
            </div>

            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-serif text-gold">
                {profile.display_name || profile.username}
              </h1>
              <p className="text-text-secondary">@{profile.username}</p>
              {profile.bio && (
                <p className="text-text-secondary mt-2">{profile.bio}</p>
              )}
              <p className="text-text-muted text-sm mt-2">
                Member since {new Date(profile.created_at).toLocaleDateString()}
              </p>
            </div>

            <div className="flex gap-6 text-center">
              <div>
                <p className="text-xl font-bold text-gold">{ratings.length}</p>
                <p className="text-text-muted text-sm">Reviews</p>
              </div>
              <div>
                <p className="text-xl font-bold text-gold">{activities.filter(a => a.type === 'watchlist').length}</p>
                <p className="text-text-muted text-sm">Watchlist</p>
              </div>
              <div>
                <p className="text-xl font-bold text-gold">{profile.follower_count || 0}</p>
                <p className="text-text-muted text-sm">Followers</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-serif text-gold mb-6">📝 Recent Activity</h2>
          {activities.length === 0 ? (
            <p className="text-text-muted">No activity yet</p>
          ) : (
            <div className="space-y-3">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="p-4 bg-surface-elevated rounded-xl border border-gray-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    {activity.type === 'rated' && (
                      <>
                        <span className="text-2xl">⭐</span>
                        <span className="text-white">
                          Rated <span className="text-gold font-bold">
                            {activity.movie?.title}
                          </span> {activity.data.rating}/10
                        </span>
                      </>
                    )}
                    {activity.type === 'watchlist' && (
                      <>
                        <span className="text-2xl">📋</span>
                        <span className="text-white">
                          Added <span className="text-gold font-bold">
                            {activity.movie?.title}
                          </span> to watchlist
                        </span>
                      </>
                    )}
                    <span className="text-text-muted text-sm ml-auto">
                      {new Date(activity.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <button
                    onClick={handleWatchNow}
                    className="px-3 py-1 bg-gold/20 text-gold text-xs rounded-full hover:bg-gold/40 transition font-medium flex-shrink-0"
                  >
                    ▶️ Watch
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {ratings.length > 0 && (
          <div>
            <h2 className="text-2xl font-serif text-gold mb-6">⭐ My Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ratings.slice(0, 6).map((rating) => (
                <Link href={`/movie/${rating.movie.id}`} key={rating.id}>
                  <div className="p-4 bg-surface-elevated rounded-xl border border-gray-800 hover:border-gold/30 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-16 relative flex-shrink-0">
                        {rating.movie.poster_path ? (
                          <Image
                            src={`https://image.tmdb.org/t/p/w200${rating.movie.poster_path}`}
                            alt={rating.movie.title}
                            fill
                            className="object-cover rounded"
                          />
                        ) : (
                          <div className="w-full h-full bg-surface-elevated rounded flex items-center justify-center text-2xl">
                            🎬
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium truncate">{rating.movie.title}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-gold font-bold">{rating.rating}/10</span>
                          <span className="text-text-muted text-sm">
                            {new Date(rating.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {rating.review_text && (
                          <p className="text-text-secondary text-sm line-clamp-2 mt-1">
                            {rating.review_text}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={handleWatchNow}
                        className="flex-shrink-0 px-3 py-1 bg-gold/20 text-gold text-xs rounded-full hover:bg-gold/40 transition font-medium"
                      >
                        ▶️ Watch
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
