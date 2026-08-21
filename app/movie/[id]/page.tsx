import CommentSection from '@/components/CommentSection';
import { getMovieDetails, getMovieTrailer } from '@/lib/tmdb';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { AdNative, AdSidebar } from '@/components/Ads';

interface MoviePageProps {
  params: {
    id: string;
  };
}

export default async function MoviePage({ params }: MoviePageProps) {
  const movieId = parseInt(params.id);
  
  if (isNaN(movieId)) {
    notFound();
  }

  const movie = await getMovieDetails(movieId);
  const trailerKey = await getMovieTrailer(movieId);

  if (!movie || !movie.id) {
    notFound();
  }

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/placeholder-poster.jpg';

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;

  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : '0.0';

  return (
    <div className="min-h-screen bg-black">
      {/* Backdrop */}
      {backdropUrl && (
        <div className="relative h-[50vh] w-full">
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
          <div className="max-w-7xl mx-auto px-4 -mt-32 relative z-10">
  <div className="flex flex-col md:flex-row gap-8">
    {/* Left Column */}
    <div className="flex-1">
      {/* Movie content */}
      
      {/* Native Ad between sections */}
      <AdNative />
      
      {/* Ratings section */}
      
      {/* Another Native Ad */}
      <AdNative />
      
      {/* Comments section */}
    </div>

    {/* Right Column - Sidebar (Desktop only) */}
    <div className="w-64 flex-shrink-0 hidden md:block">
      <AdSidebar />
    </div>
  </div>
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

            <div className="flex flex-wrap items-center gap-4 mt-4">
              <span className="text-3xl font-bold text-gold">{rating}</span>
              <span className="text-text-secondary">/ 10</span>
              <span className="text-text-muted">•</span>
              <span className="text-text-secondary">{movie.vote_count || 0} votes</span>
              <span className="text-text-muted">•</span>
              <span className="text-text-secondary">{movie.runtime || '?'} min</span>
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
          </div>
        </div>
      </div>

      {/* Cast Section */}
      {movie.credits?.cast?.slice(0, 10).length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-serif text-gold mb-6">Cast</h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {movie.credits.cast.slice(0, 10).map((actor: any) => (
              <div key={actor.id} className="flex-shrink-0 text-center w-24">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-surface-elevated">
                  {actor.profile_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                      alt={actor.name}
                      width={96}
                      height={96}
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl bg-surface-elevated">
                      🎭
                    </div>
                  )}
                </div>
                <p className="text-white text-sm mt-2 truncate">{actor.name}</p>
                <p className="text-text-muted text-xs truncate">{actor.character}</p>
                    </div>

      {/* Comment Section */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <CommentSection targetId={params.id} targetType="movie" />
      </div>
    </div>
  );
          }
          
