'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Movie } from '@/lib/tmdb';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/placeholder-poster.jpg';

  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : '0.0';
  const year = movie.release_date?.split('-')[0] || 'TBA';

  return (
    <Link href={`/movie/${movie.id}`}>
      <div className="group bg-surface rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer border border-gray-800/50 hover:border-gold/30">
        <div className="relative aspect-[2/3]">
          <Image
            src={posterUrl}
            alt={movie.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
          <div className="absolute top-3 right-3 bg-black/80 backdrop-blur px-3 py-1 rounded-full border border-gold/30">
            <span className="text-gold text-sm font-bold">{rating}</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-4 text-white/80 text-sm">
              <span>⭐ {rating}</span>
              <span>🎬 {movie.vote_count || 0} votes</span>
            </div>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-white font-semibold truncate">{movie.title}</h3>
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <span>{year}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
