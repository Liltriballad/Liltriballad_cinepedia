
import React, { useState, useEffect } from 'react';
import { Movie } from '../types';

interface HeroProps {
  movies: Movie[];
  onSelect: (m: Movie) => void;
}

const Hero: React.FC<HeroProps> = ({ movies, onSelect }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const featured = movies.length > 0 ? movies[currentIndex % movies.length] : null;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => prev + 1);
    }, 8000);
    return () => clearInterval(timer);
  }, [movies.length]);

  if (!featured) return <div className="h-[500px] w-full bg-white/5 animate-pulse rounded-3xl"></div>;

  return (
    <div className="relative w-full h-[600px] rounded-3xl overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
      <div className="absolute inset-0">
        <img 
          key={featured.imdbID}
          src={featured.Poster !== 'N/A' ? featured.Poster.replace("300.jpg", "1000.jpg") : 'https://picsum.photos/1200/800'} 
          className="w-full h-full object-cover transition-opacity duration-1000"
          alt={featured.Title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary)] via-[var(--primary)]/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)] via-transparent to-transparent"></div>
      </div>

      <div className="absolute bottom-0 left-0 p-8 md:p-16 max-w-3xl">
        <div className="flex items-center gap-3 mb-4">
          <span className="bg-[var(--accent)] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest animate-bounce">
            Featured Spotlight
          </span>
          <span className="text-white/60 font-medium">{featured.Year}</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight drop-shadow-2xl">
          {featured.Title}
        </h1>
        <p className="text-lg text-white/70 mb-8 line-clamp-3 md:line-clamp-4 max-w-xl leading-relaxed">
          {featured.Plot || "Enter a world of high-stakes action and breathtaking visual effects in this award-winning masterpiece."}
        </p>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => onSelect(featured)}
            className="bg-white text-black hover:bg-[var(--accent)] hover:text-white transition-all px-8 py-4 rounded-xl font-bold flex items-center gap-3 active:scale-95 shadow-lg"
          >
            <i className="fas fa-play"></i> Watch Now
          </button>
          <button 
            onClick={() => onSelect(featured)}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-xl font-bold flex items-center gap-3 transition-all active:scale-95 shadow-lg"
          >
            <i className="fas fa-info-circle"></i> View Details
          </button>
        </div>
      </div>

      {/* Hero Indicators */}
      <div className="absolute right-8 bottom-8 flex gap-2">
        {movies.slice(0, 5).map((_, i) => (
          <div 
            key={i}
            className={`h-1.5 rounded-full transition-all duration-500 ${i === (currentIndex % 5) ? 'w-12 bg-[var(--accent)]' : 'w-4 bg-white/20'}`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Hero;
