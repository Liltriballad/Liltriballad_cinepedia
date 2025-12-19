
import React from 'react';
import { UserProfile, Movie } from '../types';

interface UserDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  movies: Movie[];
  onSelectMovie: (m: Movie) => void;
  onSearchTrigger?: (query: string) => void;
  onClearSearchHistory?: () => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ isOpen, onClose, user, movies, onSelectMovie, onSearchTrigger, onClearSearchHistory }) => {
  if (!isOpen) return null;

  const xpPercent = (user.xp / user.xpToNext) * 100;
  
  // Filter movies that are in the user's watchlist
  const watchlistMovies = movies.filter(m => user.watchlist.includes(m.imdbID));

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl animate-[fadeIn_0.3s]" onClick={onClose}></div>
      
      <div className="relative w-full max-w-6xl h-[90vh] bg-[#0c0c14] border border-white/10 rounded-[3rem] shadow-2xl overflow-y-auto custom-scrollbar animate-popup">
        {/* Header Profile Section */}
        <div className="relative h-72 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-light)] flex flex-col items-center justify-center p-12 text-center overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/shattered-island.png')]"></div>
          <div className="relative z-10 animate-[fadeIn_0.8s]">
            <div className="w-28 h-28 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-5xl font-black mb-6 border-4 border-white/30 shadow-2xl hover:scale-110 transition-transform cursor-help" title="Elite Cine-Member Avatar">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <h1 className="text-4xl font-black tracking-tighter drop-shadow-lg">Level {user.level} • {user.name}</h1>
            <p className="text-white/60 font-black text-[10px] uppercase tracking-[6px] mt-3 italic opacity-80">Elite Cine Member</p>
          </div>
          
          {/* XP Progress Hub */}
          <div className="absolute bottom-0 left-0 w-full px-12 py-8 bg-black/40 backdrop-blur-md">
            <div className="flex justify-between items-end mb-3 text-[10px] font-black uppercase tracking-[3px]">
              <span className="flex items-center gap-2"><i className="fas fa-bolt text-yellow-400"></i> {user.xp} XP</span>
              <span className="text-white/40">Level {user.level + 1} Target: {user.xpToNext} XP</span>
            </div>
            <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-white via-white/80 to-white shadow-[0_0_20px_white] transition-all duration-[1.5s] ease-out" 
                style={{ width: `${xpPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12 space-y-20">
          {/* Stats Hub */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <UserStat label="Library" value={user.watchlist.length} icon="fa-film" />
            <UserStat label="Trophies" value={user.badges.length} icon="fa-medal" />
            <UserStat label="Global Rank" value={`#${125}`} icon="fa-trophy" />
            <UserStat label="History" value={user.history.length} icon="fa-clock-rotate-left" />
          </div>

          {/* WATCHLIST SECTION */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xs font-black uppercase tracking-[4px] text-white/20 flex items-center gap-3">
                <i className="fas fa-heart text-red-500"></i> My Private Collection
              </h3>
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{watchlistMovies.length} Saved Entries</span>
            </div>
            
            {watchlistMovies.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {watchlistMovies.map(movie => (
                  <div 
                    key={movie.imdbID}
                    onClick={() => onSelectMovie(movie)}
                    className="group relative aspect-[2/3] rounded-2xl overflow-hidden border border-white/5 cursor-pointer hover:border-[var(--accent)] transition-all hover:scale-105 shadow-xl"
                  >
                    <img 
                      src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'} 
                      alt={movie.Title}
                      className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                      <p className="text-white text-[10px] font-black uppercase truncate">{movie.Title}</p>
                      <p className="text-[var(--accent)] text-[8px] font-bold mt-1">{movie.Year}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-16 border-2 border-dashed border-white/5 rounded-[3rem] text-center">
                <i className="far fa-heart text-white/10 text-4xl mb-6"></i>
                <p className="text-white/20 text-xs font-black uppercase tracking-widest">Your library is currently empty</p>
                <p className="text-white/10 text-[10px] mt-2 italic">Start liking movies to populate your private vault.</p>
              </div>
            )}
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Left: Community & Timeline */}
            <div className="lg:col-span-4 space-y-16">
              <section>
                <h3 className="text-xs font-black uppercase tracking-[4px] text-white/20 mb-8 flex items-center gap-3">
                  <i className="fas fa-users text-[var(--accent)]"></i> CineVerse Feed
                </h3>
                <div className="space-y-5">
                  <ActivityFeedItem name="Lisa Smith" action="Unlocked 'Critic' Badge" time="3m ago" avatar="LS" color="bg-blue-500" />
                  <ActivityFeedItem name="Max K." action="Rated Interstellar 5/5" time="10m ago" avatar="MK" color="bg-purple-500" />
                  <ActivityFeedItem name="Admin" action="Updated Library Assets" time="1h ago" avatar="CP" color="bg-[var(--accent)]" />
                </div>
              </section>

              <section>
                <h3 className="text-xs font-black uppercase tracking-[4px] text-white/20 mb-8 flex items-center gap-3">
                  <i className="fas fa-bolt text-[var(--accent)]"></i> Activity Audit
                </h3>
                <div className="relative border-l-2 border-white/5 pl-8 space-y-10">
                  {user.timeline.map(item => (
                    <div key={item.id} className="relative group">
                      <div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-[var(--accent)] shadow-[0_0_15px_var(--accent)] group-hover:scale-125 transition-transform"></div>
                      <p className="text-sm font-bold leading-tight" dangerouslySetInnerHTML={{ __html: item.title }}></p>
                      <p className="text-[10px] text-white/30 uppercase mt-2 font-bold tracking-widest">{item.meta}</p>
                    </div>
                  ))}
                  {user.timeline.length === 0 && <p className="text-xs text-white/20 italic">Your journey is just beginning.</p>}
                </div>
              </section>
            </div>

            {/* Right: Personalization & System Insights */}
            <div className="lg:col-span-8 space-y-16">
              <section>
                <h3 className="text-xs font-black uppercase tracking-[4px] text-white/20 mb-8 flex items-center gap-3">
                  <i className="fas fa-clapperboard text-[var(--accent)]"></i> Curated Recommendations
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                   <RecommendCard title="Relaxed Mood" icon="fa-cloud-moon" description="Calm Cinema" />
                   <RecommendCard title="Quick Watch" icon="fa-hourglass-half" description="Short Films" />
                   <RecommendCard title="Trending" icon="fa-globe" description="Local Hits" />
                </div>
              </section>

              <section>
                <h3 className="text-xs font-black uppercase tracking-[4px] text-white/20 mb-8">Account Activity Hub</h3>
                <div className="bg-white/5 rounded-[2.5rem] p-10 border border-white/5 grid grid-cols-1 md:grid-cols-2 gap-12 font-mono text-[11px] text-white/40">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-white font-bold uppercase tracking-[3px] text-[9px]">Search Pattern History</h4>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onClearSearchHistory?.(); }}
                        className="text-[8px] font-black uppercase tracking-widest text-red-500/40 hover:text-red-500 transition-colors flex items-center gap-2 px-2 py-1 rounded-md hover:bg-red-500/5"
                        title="Purge Search History"
                      >
                        <i className="fas fa-trash-can"></i> Clear
                      </button>
                    </div>
                    <ul className="space-y-3">
                      {user.searchHistory.map((s, i) => (
                        <li 
                          key={i} 
                          onClick={() => onSearchTrigger?.(s)}
                          className="flex items-center gap-3 hover:text-white hover:bg-white/5 p-2 -m-2 rounded-xl transition-all cursor-pointer group/history"
                        >
                          <span className="text-[var(--accent)] font-black group-hover/history:scale-125 transition-transform">#</span> 
                          <span className="flex-1 truncate">{s}</span>
                          <i className="fas fa-arrow-right text-[10px] opacity-0 group-hover/history:opacity-100 transition-opacity"></i>
                        </li>
                      ))}
                      {user.searchHistory.length === 0 && <li className="italic opacity-30">Registry empty.</li>}
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-white font-bold uppercase mb-6 tracking-[3px] text-[9px]">Session Metadata</h4>
                    <div className="space-y-2 opacity-80">
                      <p className="flex justify-between"><span>IP_ADDR:</span> <span className="text-white">192.168.1.104</span></p>
                      <p className="flex justify-between"><span>BROWSER:</span> <span className="text-white">Chrome v122</span></p>
                      <p className="flex justify-between"><span>ENCRYPTION:</span> <span className="text-green-500 font-bold">AES-256-GCM</span></p>
                      <p className="flex justify-between"><span>LAST_UP:</span> <span className="text-white">Today 14:22</span></p>
                    </div>
                  </div>
                </div>
              </section>
              
              <section>
                <h3 className="text-xs font-black uppercase tracking-[4px] text-white/20 mb-8">Achievement Gallery</h3>
                <div className="flex flex-wrap gap-4">
                    {user.badges.map((b, i) => (
                        <div key={i} className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3 hover:bg-[var(--accent)]/20 transition-all cursor-default group">
                            <i className="fas fa-award text-[var(--accent)] group-hover:scale-125 transition-transform"></i>
                            <span className="text-[10px] font-black uppercase tracking-widest">{b}</span>
                        </div>
                    ))}
                </div>
              </section>
            </div>
          </div>
        </div>
        
        <div className="p-12 border-t border-white/5 bg-white/[0.01] flex justify-center">
            <button 
              onClick={onClose} 
              className="px-16 py-5 bg-white text-black font-black uppercase text-xs rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all tracking-[4px]"
            >
              Exit Dashboard
            </button>
        </div>
      </div>
    </div>
  );
};

// UI Helpers
const UserStat = ({ label, value, icon }: any) => (
  <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5 flex items-center gap-6 group hover:border-[var(--accent)]/30 transition-all cursor-default">
    <div className="w-14 h-14 bg-[var(--accent)]/10 rounded-2xl flex items-center justify-center text-[var(--accent)] text-xl group-hover:scale-110 group-hover:bg-[var(--accent)] group-hover:text-white transition-all duration-500">
      <i className={`fas ${icon}`}></i>
    </div>
    <div>
      <p className="text-3xl font-black">{value}</p>
      <p className="text-[9px] uppercase font-black text-white/30 tracking-[3px] mt-1">{label}</p>
    </div>
  </div>
);

const ActivityFeedItem = ({ name, action, time, avatar, color }: any) => (
  <div className="flex items-center gap-5 p-4 bg-white/[0.02] rounded-[1.5rem] border border-white/5 hover:bg-white/5 transition-colors cursor-default">
    <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center text-[10px] font-bold shadow-lg`}>{avatar}</div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-bold truncate">{name}</p>
      <p className="text-[10px] text-white/40 truncate font-medium uppercase tracking-widest mt-0.5">{action}</p>
    </div>
    <span className="text-[9px] text-white/20 uppercase font-bold tracking-tighter">{time}</span>
  </div>
);

const RecommendCard = ({ title, icon, description }: any) => (
  <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5 text-center cursor-pointer hover:border-[var(--accent)]/30 hover:bg-[var(--accent)]/5 transition-all group">
    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-[var(--accent)]/20 transition-colors">
        <i className={`fas ${icon} text-2xl text-[var(--accent)] group-hover:scale-125 transition-transform duration-500`}></i>
    </div>
    <p className="text-xs font-black uppercase tracking-[2px]">{title}</p>
    <p className="text-[9px] text-white/20 mt-2 uppercase font-bold tracking-widest">{description}</p>
  </div>
);

export default UserDashboard;
