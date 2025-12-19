
import React from 'react';
import { Movie } from '../types';

interface AutoSliderProps {
  movies: Movie[];
  onSelect: (m: Movie) => void;
}

const AutoSlider: React.FC<AutoSliderProps> = ({ movies, onSelect }) => {
  // Filter out movies without posters
  const validMovies = movies.filter(m => m.Poster && m.Poster !== 'N/A');
  
  // Double the movies to create a seamless infinite loop
  const displayMovies = [...validMovies, ...validMovies];

  if (validMovies.length === 0) return null;

  return (
    <section className="overflow-hidden relative">
      <div className="mb-6">
        <h2 className="text-xl font-black flex items-center gap-3 opacity-60 uppercase tracking-[4px]">
          <i className="fas fa-bolt text-[var(--accent)] animate-pulse"></i>
          Trending Now
        </h2>
      </div>
      
      {/* Gradient Overlays for smooth edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-[var(--bg)] to-transparent pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-[var(--bg)] to-transparent pointer-events-none"></div>

      <div className="flex animate-marquee py-4">
        {displayMovies.map((movie, idx) => (
          <div 
            key={`${movie.imdbID}-${idx}`} 
            onClick={() => onSelect(movie)}
            className="w-48 h-72 mx-3 flex-shrink-0 rounded-2xl overflow-hidden shadow-xl border border-white/5 group transition-all duration-500 hover:scale-110 hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] cursor-pointer relative z-0 hover:z-50"
          >
            <img 
              src={movie.Poster} 
              alt={movie.Title} 
              className="w-full h-full object-cover transition-all duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
              <span className="text-white text-xs font-bold truncate">{movie.Title}</span>
              <span className="text-[var(--accent)] text-[10px] font-bold tracking-tighter uppercase">{movie.Year}</span>
            </div>
            
            {/* "Quick View" Overlay Icon */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
              <div className="w-10 h-10 bg-[var(--accent)] rounded-full flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform duration-300">
                <i className="fas fa-expand-alt"></i>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AutoSlider;
