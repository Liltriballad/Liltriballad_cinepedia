
import React, { useState, useEffect, useRef } from 'react';
import { ThemeType, UserProfile, Movie } from '../types';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  theme: ThemeType;
  setTheme: (t: ThemeType) => void;
  searchQuery: string;
  onSearch: (q: string) => void;
  onOpenSidebar: () => void;
  user: UserProfile;
  movies: Movie[];
  cloudStatus?: 'connected' | 'syncing' | 'error';
}

const Header: React.FC<HeaderProps> = ({ theme, setTheme, searchQuery, onSearch, onOpenSidebar, user, movies, cloudStatus }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    const filtered = movies.filter(m => m.Title.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 8);
    setSuggestions(filtered);
    if (filtered.length > 0 && isFocused) setShowDropdown(true);
    else setShowDropdown(false);
  }, [searchQuery, movies, isFocused]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setShowDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-[150] bg-[#0c0c14]/80 backdrop-blur-2xl border-b border-white/5 py-4 px-6 transition-all duration-700">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
        
        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
          <div className="w-11 h-11 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-light)] rounded-[1rem] flex items-center justify-center shadow-xl group-hover:rotate-12 transition-all">
            <i className="fas fa-film text-white text-xl"></i>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-2xl font-black bg-gradient-to-r from-[var(--accent)] to-[var(--accent-light)] bg-clip-text text-transparent uppercase tracking-tighter">
              CinePedia
            </h1>
            <div className="flex items-center gap-2">
              <p className="text-[9px] font-black text-white/20 uppercase tracking-[4px]">Command Center</p>
              {cloudStatus && (
                <div className={`w-1.5 h-1.5 rounded-full ${cloudStatus === 'connected' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : cloudStatus === 'syncing' ? 'bg-blue-400 animate-pulse' : 'bg-red-500'}`} title={`MongoDB Status: ${cloudStatus}`}></div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-2xl relative group" ref={dropdownRef}>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search" 
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-14 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:bg-white/[0.08] transition-all placeholder:text-white/20 text-sm font-semibold"
            />
            <i className="fas fa-search absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[var(--accent)] transition-colors"></i>
          </div>

          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-3 bg-black/80 backdrop-blur-3xl border border-white/10 rounded-[2rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)] animate-popup z-[200]">
              <div className="p-2">
                {suggestions.map((item) => (
                  <div key={item.imdbID} onClick={() => { onSearch(item.Title); setShowDropdown(false); }} className="flex items-center gap-4 p-3 hover:bg-white/10 rounded-2xl cursor-pointer group transition-all">
                    <img src={item.Poster} className="w-10 h-14 rounded-lg object-cover" alt={item.Title} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-white truncate group-hover:text-[var(--accent)]">{item.Title}</p>
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{item.Year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-5">
          <ThemeToggle theme={theme} setTheme={setTheme} />
          <button onClick={onOpenSidebar} className="group flex items-center gap-3 p-1 pr-4 bg-white/5 border border-white/10 rounded-full hover:border-[var(--accent)] transition-all">
            <div className="w-10 h-10 bg-[var(--accent)] rounded-full flex items-center justify-center text-white font-black text-xs">
               {user.level}
            </div>
            <span className="hidden lg:block text-[10px] font-black uppercase tracking-widest text-white/60 group-hover:text-white">Profile</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
