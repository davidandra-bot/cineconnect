'use client';

import { useState } from 'react';

interface RatingStarsProps {
  initialRating?: number;
  onRating: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function RatingStars({
  initialRating = 0,
  onRating,
  readonly = false,
  size = 'md',
}: RatingStarsProps) {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const starSize = sizeClasses[size];

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => {
            if (!readonly) {
              setRating(star);
              onRating(star);
            }
          }}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          className={`${starSize} transition-colors duration-150 ${
            (hover || rating) >= star
              ? 'text-gold fill-gold'
              : 'text-gray-600 fill-gray-600'
          } ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
          disabled={readonly}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 15.585L4.472 18l1.02-5.764L1 7.472l5.764-.842L10 1l3.236 5.63L19 7.472l-4.492 4.764L15.528 18 10 15.585z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      ))}
      {rating > 0 && !readonly && (
        <span className="ml-2 text-sm text-text-secondary">
          {rating.toFixed(1)} / 10
        </span>
      )}
    </div>
  );
}
