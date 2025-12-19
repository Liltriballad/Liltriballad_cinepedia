
import React, { useState } from 'react';
import { Movie, ThemeType } from '../types';

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
  theme: ThemeType;
  onWatch?: () => void;
  onToggleWatchlist?: (id: string) => void;
  isWatched?: boolean;
}

const MovieModal: React.FC<MovieModalProps> = ({ movie, onClose, theme, onWatch, onToggleWatchlist, isWatched }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleStartWatching = () => {
    if (!isPlaying && onWatch) onWatch();
    setIsPlaying(true);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 md:p-10" onClick={onClose}>
      <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl animate-[fadeIn_0.3s]"></div>
      
      <div className={`relative w-full max-w-7xl max-h-[95vh] overflow-y-auto rounded-[3rem] border border-white/10 shadow-2xl bg-[#0f0f1a] animate-popup custom-scrollbar`} onClick={e => e.stopPropagation()}>
        <div className="absolute top-6 right-6 z-[60] flex items-center gap-4">
           <button onClick={(e) => { e.stopPropagation(); onToggleWatchlist?.(movie.imdbID); }} className={`w-12 h-12 flex items-center justify-center rounded-full border transition-all ${isWatched ? 'bg-red-500 text-white border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'bg-black/40 border-white/10 text-white/40 hover:text-white hover:bg-black/60'}`}>
              <i className={`${isWatched ? 'fas' : 'far'} fa-heart text-lg`}></i>
            </button>
            <button onClick={onClose} className="w-12 h-12 flex items-center justify-center bg-black/40 hover:bg-red-500/80 border border-white/10 rounded-full text-white">
              <i className="fas fa-times text-xl"></i>
            </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-0 min-h-[600px]">
          <div className="w-full lg:w-[45%] relative bg-black flex items-center justify-center min-h-[400px] overflow-hidden">
            {isPlaying && movie.VideoURL ? (
              <iframe src={`${movie.VideoURL}${movie.VideoURL.includes('?') ? '&' : '?'}autoplay=1`} title="Movie Trailer" className="w-full h-full absolute inset-0 border-0" allow="autoplay; encrypted-media" allowFullScreen></iframe>
            ) : (
              <>
                <img src={movie.Poster !== 'N/A' ? movie.Poster.replace("300.jpg", "1000.jpg") : 'https://picsum.photos/600/900'} alt={movie.Title} className="w-full h-full object-cover opacity-60 scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f1a] via-transparent to-transparent"></div>
                {!isPlaying && (
                   <button onClick={handleStartWatching} className="absolute inset-0 flex items-center justify-center group">
                     <div className="w-24 h-24 bg-[var(--accent)] rounded-full flex items-center justify-center text-white text-4xl shadow-[0_0_50px_var(--accent)] group-hover:scale-110 transition-transform">
                        <i className="fas fa-play ml-1"></i>
                     </div>
                   </button>
                )}
              </>
            )}
          </div>

          <div className="w-full lg:w-[55%] p-10 lg:p-20 flex flex-col gap-12">
            <div>
              <div className="flex flex-wrap items-center gap-5 mb-8">
                <span className="px-5 py-2 bg-[var(--accent)] rounded-full text-[10px] font-black uppercase tracking-widest text-white">{movie.Year}</span>
                <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">{movie.Genre}</span>
                <div className="flex items-center gap-2 text-yellow-400 font-black">
                   <span className="text-2xl">{movie.imdbRating || '8.5'}</span>
                   <i className="fas fa-star text-sm"></i>
                </div>
              </div>
              
              <h2 className="text-5xl lg:text-7xl font-black mb-10 tracking-tighter leading-none text-white">{movie.Title}</h2>
              
              <div className="space-y-8">
                <div className="relative pl-8">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--accent)] rounded-full"></div>
                  <p className="text-lg text-white/70 leading-relaxed font-medium">{movie.Plot}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 mt-12">
                 <div>
                   <h4 className="text-[10px] font-black uppercase text-white/20 tracking-[4px] mb-4">Director</h4>
                   <p className="text-white font-black text-xl">{movie.Director}</p>
                 </div>
                 <div>
                   <h4 className="text-[10px] font-black uppercase text-white/20 tracking-[4px] mb-4">Box Office</h4>
                   <p className="text-[var(--accent)] font-black text-xl">{movie.BoxOffice}</p>
                 </div>
              </div>
            </div>

            <div className="mt-auto flex flex-col sm:flex-row gap-6">
              <button onClick={handleStartWatching} className="flex-1 bg-white text-black font-black py-6 rounded-[2.5rem] flex items-center justify-center gap-4 hover:bg-[var(--accent)] hover:text-white transition-all uppercase tracking-[4px] text-xs">
                <i className="fas fa-play"></i> Watch
              </button>
              {movie.DownloadURL && (
                <a href={movie.DownloadURL} target="_blank" rel="noopener noreferrer" className="flex-1 bg-white/5 border border-white/10 text-white font-black py-6 rounded-[2.5rem] flex items-center justify-center gap-4 hover:bg-white/10 transition-all uppercase tracking-[4px] text-xs">
                  <i className="fas fa-download text-[var(--accent)]"></i> Download
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;
