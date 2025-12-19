
import React, { useState, useEffect } from 'react';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  onSelect: (m: Movie) => void;
  onToggleWatchlist: (id: string) => void;
  isWatched: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onSelect, onToggleWatchlist, isWatched }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [glintKey, setGlintKey] = useState(0);

  // Trigger glint effect whenever the card flips
  useEffect(() => {
    setGlintKey(prev => prev + 1);
  }, [isFlipped]);

  const handleOpenFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(movie);
  };

  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (movie.DownloadURL) {
      window.open(movie.DownloadURL, '_blank');
    }
  };

  const handleToggleWatchlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWatchlist(movie.imdbID);
  };

  return (
    <div className="flex flex-col gap-4 group h-full">
      <div 
        className="perspective-1000 w-full aspect-[2/3] cursor-pointer"
        onClick={handleFlip}
        onDoubleClick={handleOpenFullscreen}
      >
        <div className={`
          relative w-full h-full transition-transform duration-[0.8s] transform-style-3d 
          ${isFlipped ? 'rotate-y-180' : ''}
          will-change-transform
        `}
        style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
        >
          {/* Front Face: The Poster Art */}
          <div className="absolute inset-0 backface-hidden rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 bg-[#0f0f1a]">
            
            {!imgLoaded && (
              <div className="absolute inset-0 animate-skeleton z-10 flex flex-col items-center justify-center">
                <i className="fas fa-clapperboard text-white/10 text-4xl mb-4 animate-pulse"></i>
              </div>
            )}

            <img 
              src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'} 
              alt={movie.Title}
              onLoad={() => setImgLoaded(true)}
              className={`
                w-full h-full object-cover transition-all duration-700 
                ${imgLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'} 
                group-hover:scale-110 group-hover:rotate-1
              `}
              loading="lazy"
            />

            <div 
              key={`glint-front-${glintKey}`}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none z-40 animate-glint" 
              style={{ display: glintKey > 0 ? 'block' : 'none' }}
            ></div>

            {/* Quick Watch Trigger on Front */}
            <div className="absolute inset-0 z-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-black/40 backdrop-blur-[4px]">
               <button 
                onClick={handleOpenFullscreen}
                className="px-8 py-3 bg-white text-black rounded-full font-black text-xs uppercase tracking-[3px] shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-110 transition-transform active:scale-95"
               >
                  <i className="fas fa-play mr-2"></i> Quick Watch
               </button>
            </div>

            {/* Manual Flip Toggle Icon */}
            <button 
              onClick={handleFlip}
              className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-white/40 hover:text-white transition-all opacity-0 group-hover:opacity-100"
              title="Flip for Info"
            >
               <i className="fas fa-info-circle"></i>
            </button>
            
            <div className={`absolute bottom-0 left-0 w-full p-6 z-20 transition-all duration-500 translate-y-2 group-hover:translate-y-0 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}>
                <div className="flex items-center gap-3 mb-2">
                   <span className="px-2 py-0.5 bg-[var(--accent)] text-white text-[8px] font-black rounded uppercase tracking-widest">{movie.Year}</span>
                   <span className="text-yellow-400 text-[10px] font-black">{movie.imdbRating || '8.5'} ⭐</span>
                </div>
                <h3 className="font-black text-white text-base leading-tight tracking-tighter line-clamp-1">{movie.Title}</h3>
            </div>
          </div>

          {/* Back Face: Mini-Dashboard & Actions */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-[2.5rem] overflow-hidden shadow-2xl border-2 border-[var(--accent)]/50 bg-[#0c0c14] flex flex-col">
            
            <div 
              key={`glint-back-${glintKey}`}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none z-40 animate-glint" 
            ></div>

            {/* Like Button (Top-Left) */}
            <button 
              onClick={handleToggleWatchlist}
              className={`absolute top-4 left-4 w-10 h-10 rounded-full border transition-all z-50 flex items-center justify-center active:scale-90 ${isWatched ? 'bg-red-500 text-white border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'bg-white/5 border-white/10 text-white/30 hover:text-white hover:bg-white/10'}`}
              title={isWatched ? "Remove from Library" : "Add to Library"}
            >
              <i className={`${isWatched ? 'fas' : 'far'} fa-heart text-sm`}></i>
            </button>

            {/* Back to Front Trigger (Top-Right) */}
            <button 
              onClick={handleFlip}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all z-50 text-white/40 hover:text-white"
            >
               <i className="fas fa-rotate-left"></i>
            </button>

            {/* Mini Details */}
            <div className="p-8 pt-16 flex-1 flex flex-col">
              <div className="mb-4">
                <h3 className="font-black text-[var(--accent)] text-lg tracking-tighter line-clamp-1 mb-1 uppercase">{movie.Title}</h3>
                <p className="text-white/40 text-[9px] font-black mb-3 uppercase tracking-[3px]">{movie.Genre?.split(',')[0] || 'MASTERPIECE'}</p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Director</p>
                  <p className="text-[11px] font-bold text-white/80 truncate">{movie.Director || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Cast</p>
                  <p className="text-[11px] font-bold text-white/80 line-clamp-2">{movie.Actors || 'N/A'}</p>
                </div>
              </div>
              
              <div className="mt-auto space-y-3">
                <button 
                  onClick={handleOpenFullscreen}
                  className="w-full bg-white text-black text-[10px] font-black py-4 rounded-2xl hover:bg-[var(--accent)] hover:text-white transition-all duration-300 uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95"
                >
                  <i className="fas fa-play"></i> Watch Trailer
                </button>

                {movie.DownloadURL && (
                  <button 
                    onClick={handleDownload}
                    className="w-full flex items-center justify-center gap-3 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[3px] text-white transition-all duration-300 shadow-xl active:scale-95"
                  >
                    <i className="fas fa-cloud-arrow-down text-[var(--accent)]"></i> Download
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
