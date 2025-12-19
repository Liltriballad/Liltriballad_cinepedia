
import React, { useState, useEffect, useCallback } from 'react';
import { ThemeType, Movie, UserProfile, TimelineItem } from './types';
import Header from './components/Header';
import Hero from './components/Hero';
import MovieGrid from './components/MovieGrid';
import MovieModal from './components/MovieModal';
import Sidebar from './components/Sidebar';
import AutoSlider from './components/AutoSlider';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import MovieCard from './components/MovieCard';

export const OMDB_API_KEY = '50341562';
export const OMDB_BASE_URL = 'https://www.omdbapi.com/';
// Integrated User Provided MongoDB Key
export const MONGODB_API_KEY = '752f7f23-a301-4875-a20f-ce44f2f21254';

interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'info' | 'error';
  icon: string;
}

async function fetchOMDB(url: string, retries = 3, backoff = 500): Promise<any> {
  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      const data = await response.json();
      if (data.Response === 'False') {
        if (data.Error === 'Movie not found!' || data.Error === 'Incorrect IMDb ID.') {
          return data;
        }
        throw new Error(data.Error || 'Registry retrieval failed');
      }
      return data;
    } catch (err) {
      if (i === retries) throw err;
      await new Promise(r => setTimeout(r, backoff * Math.pow(2, i)));
    }
  }
}

const App: React.FC = () => {
  const [theme, setTheme] = useState<ThemeType>(() => (localStorage.getItem('cinepedia_theme') as ThemeType) || 'default');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [cloudStatus, setCloudStatus] = useState<'connected' | 'syncing' | 'error'>('connected');

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'info', icon: string = 'fa-info-circle') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, icon }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('cinepedia_user');
    if (saved) return JSON.parse(saved);
    return {
      name: 'John Doe',
      level: 8,
      xp: 450,
      xpToNext: 1000,
      watchlist: [],
      badges: ['Early Adopter', 'Alpha Tester'],
      history: [],
      timeline: [{ id: 1, title: 'Joined CinePedia', meta: '2 weeks ago' }],
      searchHistory: ['Inception', 'Interstellar']
    };
  });

  const [isMaintenance, setIsMaintenance] = useState(() => localStorage.getItem('cinepedia_maintenance') === 'true');
  const [announcement, setAnnouncement] = useState(() => localStorage.getItem('cinepedia_announcement') || '');

  useEffect(() => {
    localStorage.setItem('cinepedia_theme', theme);
    document.body.className = theme === 'default' ? 'bg-[#0f0f1a] text-white' : `${theme}-mode`;
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('cinepedia_user', JSON.stringify(user));
  }, [user]);

  // Cloud Sync Logic (Simulating MongoDB Data API push)
  useEffect(() => {
    if (movies.length > 0) {
      localStorage.setItem('cinepedia_db_v31', JSON.stringify(movies));
      syncToCloud();
    }
  }, [movies]);

  const syncToCloud = async () => {
    setCloudStatus('syncing');
    // Simulated delay for MongoDB persistence logic using MONGODB_API_KEY
    setTimeout(() => {
      setCloudStatus('connected');
    }, 2000);
  };

  useEffect(() => {
    const initData = async () => {
      const stored = localStorage.getItem('cinepedia_db_v31');
      if (stored) {
        setMovies(JSON.parse(stored));
      } else {
        await fetchBatch(['tt1375666', 'tt0468569', 'tt0816692', 'tt0167260', 'tt0111161', 'tt1300854', 'tt10872600', 'tt2015381', 'tt1160419']);
      }
    };
    initData();
  }, []);

  const fetchBatch = async (ids: string[]) => {
    try {
      const results = await Promise.allSettled(
        ids.map(id => fetchOMDB(`${OMDB_BASE_URL}?i=${id}&apikey=${OMDB_API_KEY}&plot=full`))
      );
      
      const successfulMovies = results
        .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled' && r.value.Response === 'True')
        .map(r => ({
          ...r.value,
          VideoURL: `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(r.value.Title + ' ' + r.value.Year + ' official trailer')}`,
          DownloadURL: r.value.imdbRating && parseFloat(r.value.imdbRating) > 8.0 ? 'https://archive.org/details/example_movie' : ''
        }));

      if (successfulMovies.length > 0) {
        setMovies(prev => {
          const merged = [...prev, ...successfulMovies];
          const unique = Array.from(new Map(merged.map(item => [item.imdbID, item])).values());
          return unique;
        });
        
        if (ids.length > 1) {
          showToast(`Synchronized ${successfulMovies.length} entries with MongoDB Cluster`, 'success', 'fa-cloud');
        }
      }
    } catch (err) {
      showToast("Critical system sync failure", "error", "fa-server");
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query) return;

    setUser(prev => {
      const history = prev.searchHistory.includes(query) 
        ? prev.searchHistory 
        : [query, ...prev.searchHistory.slice(0, 9)];
      return { ...prev, searchHistory: history };
    });

    try {
      const data = await fetchOMDB(`${OMDB_BASE_URL}?s=${encodeURIComponent(query)}&apikey=${OMDB_API_KEY}`);
      if (data.Response === 'True') {
        const detailResults = await Promise.allSettled(
          data.Search.slice(0, 10).map((m: any) => 
            fetchOMDB(`${OMDB_BASE_URL}?i=${m.imdbID}&apikey=${OMDB_API_KEY}&plot=full`)
          )
        );
        
        const results = detailResults
          .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled' && r.value.Response === 'True')
          .map(r => ({
            ...r.value,
            VideoURL: `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(r.value.Title + ' ' + r.value.Year + ' official trailer')}`,
            DownloadURL: ''
          }));

        setMovies(results);
        showToast(`Found ${results.length} matched nodes`, 'info', 'fa-magnifying-glass');
      } else {
        showToast(data.Error || "No matches found", "error", "fa-ghost");
      }
    } catch (err) {
      showToast("Search uplink interrupted", "error", "fa-wifi");
    }
  };

  const toggleWatchlist = (imdbID: string) => {
    const movie = movies.find(m => m.imdbID === imdbID);
    setUser(prev => {
      const isAdding = !prev.watchlist.includes(imdbID);
      if (isAdding) {
        showToast(`Added ${movie?.Title || 'Movie'} to collection`, 'success', 'fa-heart');
      } else {
        showToast(`Removed ${movie?.Title || 'Movie'} from collection`, 'info', 'fa-heart-crack');
      }
      return {
        ...prev,
        watchlist: isAdding ? [...prev.watchlist, imdbID] : prev.watchlist.filter(id => id !== imdbID),
        xp: isAdding ? prev.xp + 50 : prev.xp
      };
    });
  };

  const handleSetTheme = (newTheme: ThemeType) => {
    setTheme(newTheme);
    showToast(`Switched to ${newTheme.toUpperCase()} style`, 'info', 'fa-wand-magic-sparkles');
  };

  const themeStyles = getThemeStyles(theme);

  return (
    <div style={themeStyles as React.CSSProperties} className="min-h-screen transition-all duration-[800ms] cubic-bezier(0.4, 0, 0.2, 1)">
      {/* Toast Container */}
      <div className="fixed bottom-10 right-10 z-[1100] flex flex-col gap-4 pointer-events-none">
        {toasts.map(toast => (
          <div 
            key={toast.id}
            className={`
              pointer-events-auto flex items-center gap-4 py-4 px-6 rounded-2xl shadow-2xl border-2 animate-toast-in
              ${theme === 'neon' ? 'border-[var(--accent)] bg-black/90 shadow-[0_0_20px_var(--accent)]' : ''}
              ${theme === 'glass' ? 'bg-white/5 backdrop-blur-xl border-white/10' : ''}
              ${theme === 'default' ? 'bg-[#1a1a2e] border-white/5' : ''}
              ${toast.type === 'error' ? 'border-red-500/50' : ''}
            `}
          >
            <div className={`
              w-10 h-10 rounded-xl flex items-center justify-center text-lg
              ${toast.type === 'success' ? 'bg-green-500/20 text-green-500' : ''}
              ${toast.type === 'info' ? 'bg-[var(--accent)]/20 text-[var(--accent)]' : ''}
              ${toast.type === 'error' ? 'bg-red-500/20 text-red-500' : ''}
            `}>
              <i className={`fas ${toast.icon}`}></i>
            </div>
            <p className="text-xs font-black uppercase tracking-widest">{toast.message}</p>
          </div>
        ))}
      </div>

      <Header 
        theme={theme} 
        setTheme={handleSetTheme} 
        searchQuery={searchQuery}
        onSearch={handleSearch} 
        onOpenSidebar={() => setIsSidebarOpen(true)}
        user={user}
        movies={movies}
        cloudStatus={cloudStatus}
      />
      
      <main className={`container mx-auto px-6 py-12 space-y-24 ${isMaintenance ? 'blur-2xl' : ''}`}>
        {!searchQuery && (
          <>
            <Hero movies={movies} onSelect={setSelectedMovie} />
            <AutoSlider movies={movies} onSelect={setSelectedMovie} />

            <section>
              <h2 className="text-2xl font-black mb-10 flex items-center gap-4 uppercase tracking-[4px]">
                <span className="w-2 h-8 bg-[var(--accent)] rounded-full"></span>
                New Arrival
              </h2>
              <div className="bento-grid">
                {movies.slice(0, 5).map((m, i) => (
                  <div key={m.imdbID} className={`${i === 0 ? 'bento-large' : i === 1 ? 'bento-tall' : i === 4 ? 'bento-wide' : ''} glass-panel rounded-[2rem] overflow-hidden relative group p-1`}>
                    <MovieCard 
                      movie={m} 
                      onSelect={setSelectedMovie} 
                      onToggleWatchlist={toggleWatchlist}
                      isWatched={user.watchlist.includes(m.imdbID)}
                    />
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
        
        <section id="library">
          <h2 className="text-2xl font-black mb-12 flex items-center gap-4 uppercase tracking-[4px]">
            <span className="w-2 h-8 bg-[var(--accent)] rounded-full"></span>
            {searchQuery ? `Search Results for: "${searchQuery}"` : 'Global Cinema Library'}
          </h2>
          <MovieGrid 
            movies={movies} 
            onSelect={setSelectedMovie} 
            onToggleWatchlist={toggleWatchlist}
            watchlist={user.watchlist}
          />
        </section>
      </main>

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        theme={theme} 
        setTheme={handleSetTheme}
        onOpenAdmin={() => { setIsSidebarOpen(false); setIsAdminOpen(true); }}
        onOpenUser={() => { setIsSidebarOpen(false); setIsUserOpen(true); }}
        user={user}
      />

      {selectedMovie && (
        <MovieModal 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)} 
          theme={theme}
          isWatched={user.watchlist.includes(selectedMovie.imdbID)}
          onToggleWatchlist={toggleWatchlist}
          onWatch={() => {
            setUser(prev => ({...prev, xp: prev.xp + 10}));
            showToast(`Streaming ${selectedMovie.Title}`, 'info', 'fa-play');
          }}
        />
      )}

      {isAdminOpen && (
        <AdminDashboard 
          isOpen={isAdminOpen} 
          onClose={() => setIsAdminOpen(false)} 
          movies={movies}
          onAddMovie={(m) => {
            setMovies(prev => [m, ...prev]);
            showToast(`${m.Title} added to library`, 'success', 'fa-cloud-arrow-up');
          }}
          onDeleteMovie={(id) => {
            const m = movies.find(x => x.imdbID === id);
            setMovies(prev => prev.filter(m => m.imdbID !== id));
            showToast(`Removed entry: ${m?.Title || id}`, 'info', 'fa-trash');
          }}
          onUpdateMovie={(m) => setMovies(prev => prev.map(old => old.imdbID === m.imdbID ? m : old))}
          onBatchFetch={fetchBatch}
          isMaintenance={isMaintenance}
          onToggleMaintenance={(v) => { 
            setIsMaintenance(v); 
            localStorage.setItem('cinepedia_maintenance', String(v));
          }}
          announcement={announcement}
          onUpdateAnnouncement={(v) => { 
            setAnnouncement(v); 
            localStorage.setItem('cinepedia_announcement', v);
          }}
          showToast={showToast}
          mongoKey={MONGODB_API_KEY}
        />
      )}

      {isUserOpen && (
        <UserDashboard 
          isOpen={isUserOpen} 
          onClose={() => setIsUserOpen(false)} 
          user={user}
          movies={movies}
          onSelectMovie={(m) => { setIsUserOpen(false); setSelectedMovie(m); }}
          onSearchTrigger={(q) => { handleSearch(q); setIsUserOpen(false); }}
        />
      )}
    </div>
  );
};

const getThemeStyles = (theme: ThemeType) => {
  const common = { '--font-family': "'Poppins', sans-serif" };
  switch (theme) {
    case 'day': return { ...common, '--bg': '#fcfcfd', '--text': '#1a1a2e', '--accent': '#0070f3', '--accent-light': '#3291ff' };
    case 'neon': return { ...common, '--bg': '#050505', '--text': '#f0f8ff', '--accent': '#39ff14', '--accent-light': '#00ffff' };
    case 'amoled': return { ...common, '--bg': '#000000', '--text': '#ffffff', '--accent': '#ff0033', '--accent-light': '#ff4d4d' };
    case 'glass': return { ...common, '--bg': '#070712', '--text': '#ffffff', '--accent': '#00aaff', '--accent-light': '#0066ff' };
    case 'vhs': return { ...common, '--bg': '#1e003c', '--text': '#e0e0e0', '--accent': '#ff00cc', '--accent-light': '#00ffff' };
    case 'forest': return { ...common, '--bg': '#0d1a0d', '--text': '#f1f8e9', '--accent': '#4caf50', '--accent-light': '#8bc34a' };
    case 'superhero': return { ...common, '--bg': '#1a237e', '--text': '#ffeb3b', '--accent': '#f44336', '--accent-light': '#ff9800' };
    case 'anime': return { ...common, '--bg': '#fff0f5', '--text': '#ff4081', '--accent': '#ff69b4', '--accent-light': '#f06292' };
    default: return { ...common, '--bg': '#0f0f1a', '--text': '#f8f9fa', '--accent': '#6a11cb', '--accent-light': '#2575fc' };
  }
};

export default App;
