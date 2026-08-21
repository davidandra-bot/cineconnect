'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Movie } from '@/lib/tmdb';

interface MovieCardProps {
  movie: Movie;
}

// 🔗 YOUR DIRECT LINK - Replace with your actual link
const YOUR_DIRECT_LINK = 'https://guyprior.com/ja5sjb490?key=e1fab3e807877144ce91bd0eda6951bc';

export default function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/placeholder-poster.jpg';

  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : '0.0';
  const year = movie.release_date?.split('-')[0] || 'TBA';

  const handleWatchNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(YOUR_DIRECT_LINK, '_blank');
  };

  return (
    <div className="group bg-surface rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer border border-gray-800/50 hover:border-gold/30">
      <Link href={`/movie/${movie.id}`}>
        <div className="relative aspect-[2/3]">
          <Image
            src={posterUrl}
            alt={movie.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
          
          {/* Rating Badge */}
          <div className="absolute top-3 right-3 bg-black/80 backdrop-blur px-3 py-1 rounded-full border border-gold/30">
            <span className="text-gold text-sm font-bold">{rating}</span>
          </div>

          {/* Hover Overlay with Watch Now Button */}
          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 p-4">
            {/* Watch Now Button */}
            <button
              onClick={handleWatchNow}
              className="px-6 py-2 bg-gold text-black rounded-lg font-bold hover:bg-gold/80 transition transform hover:scale-105 text-sm"
            >
              ▶️ Watch Now
            </button>
            
            {/* View Details Link */}
            <span className="text-text-secondary text-sm hover:text-white transition">
              View Details →
            </span>
          </div>

          {/* Bottom info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-4 text-white/80 text-sm">
              <span>⭐ {rating}</span>
              <span>🎬 {movie.vote_count || 0} votes</span>
            </div>
          </div>
        </div>
      </Link>
      
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold truncate">{movie.title}</h3>
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <span>{year}</span>
            </div>
          </div>
          {/* Small Watch Now button on card */}
          <button
            onClick={handleWatchNow}
            className="flex-shrink-0 px-3 py-1 bg-gold/20 text-gold text-xs rounded-full hover:bg-gold/40 transition font-medium"
          >
            Watch
          </button>
        </div>
      </div>
    </div>
  );
}
