import { memo } from 'react';

function StarRating({ rating = 0, size = 'sm', interactive = false, onRate }) {
  const stars = [1, 2, 3, 4, 5];
  const sizeClass = size === 'lg' ? 'text-xl' : 'text-sm';

  return (
    <span className={`inline-flex items-center gap-0.5 ${sizeClass}`}>
      {stars.map((star) => {
        const filled = rating >= star;
        const half = !filled && rating >= star - 0.5;
        return (
          <span
            key={star}
            onClick={interactive ? () => onRate?.(star) : undefined}
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''} ${filled ? 'text-amber-400' : half ? 'text-amber-400/60' : 'text-slate-600'}`}
          >
            ★
          </span>
        );
      })}
    </span>
  );
}

export default memo(StarRating);
