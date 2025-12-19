
import React, { useState } from 'react';
import { Movie } from '../types';
import MovieCard from './MovieCard';

interface MovieGridProps {
  movies: Movie[];
  onSelect: (m: Movie) => void;
  onToggleWatchlist: (id: string) => void;
  watchlist: string[];
}

const MovieGrid: React.FC<MovieGridProps> = ({ movies, onSelect, onToggleWatchlist, watchlist }) => {
  // Track which card is currently being interacted with for z-index management
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-16 gap-x-8 relative pb-20">
      {movies.map((movie, index) => {
        const isFlippedInState = activeCardId === movie.imdbID;
        return (
          <div 
            key={movie.imdbID + index} 
            className={`relative group/wrapper movie-grid-item ${isFlippedInState ? 'active-flip' : ''}`}
            onMouseEnter={() => setActiveCardId(movie.imdbID)}
            onMouseLeave={() => {
                // Keep z-index slightly longer if flipped to avoid clipping during return transition
                setTimeout(() => setActiveCardId(prev => prev === movie.imdbID ? null : prev), 300);
            }}
          >
            <MovieCard 
              movie={movie} 
              onSelect={onSelect} 
              onToggleWatchlist={onToggleWatchlist}
              isWatched={watchlist.includes(movie.imdbID)}
            />
          </div>
        );
      })}
    </div>
  );
};

export default MovieGrid;
