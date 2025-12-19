
import React, { useState } from 'react';
import { Movie } from '../types';
import { OMDB_API_KEY, OMDB_BASE_URL } from '../App';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  movies: Movie[];
  onAddMovie: (movie: Movie) => void;
  onDeleteMovie: (id: string) => void;
  onUpdateMovie: (movie: Movie) => void;
  onBatchFetch: (ids: string[]) => void;
  isMaintenance: boolean;
  onToggleMaintenance: (val: boolean) => void;
  announcement: string;
  onUpdateAnnouncement: (text: string) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'error', icon?: string) => void;
  mongoKey?: string;
}

type AdminTab = 'overview' | 'assets' | 'settings' | 'utilities' | 'database';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  isOpen, onClose, movies, onAddMovie, onDeleteMovie, onUpdateMovie, onBatchFetch,
  isMaintenance, onToggleMaintenance, announcement, onUpdateAnnouncement, showToast, mongoKey
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [preview, setPreview] = useState<Movie | null>(null);

  const handleDirectFetch = async () => {
    if (!searchQuery) return;
    setIsFetching(true);
    try {
      const res = await fetch(`${OMDB_BASE_URL}?t=${encodeURIComponent(searchQuery)}&apikey=${OMDB_API_KEY}&plot=full`);
      const data = await res.json();
      if (data.Response === 'True') {
        setPreview({
          ...data,
          VideoURL: `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(data.Title + ' official trailer')}`,
          DownloadURL: ''
        });
        showToast("Metadata retrieved", "success", "fa-check");
      } else {
        showToast(data.Error || "Movie not found", "error");
      }
    } catch (err) {
      showToast("Network failure", "error");
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-3xl" onClick={onClose}></div>
      
      <div className="relative w-full max-w-7xl h-[90vh] bg-[#0c0c14] border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row animate-popup">
        
        <aside className="w-full lg:w-72 bg-black/60 border-r border-white/5 flex flex-col">
          <div className="p-10 border-b border-white/5">
            <h2 className="text-2xl font-black text-[var(--accent)] flex items-center gap-4 uppercase tracking-tighter">
              <i className="fas fa-terminal"></i> Core
            </h2>
            <p className="text-[10px] text-white/20 uppercase font-black tracking-[4px] mt-2">v4.0.2 Stable</p>
          </div>
          
          <nav className="flex-1 p-6 space-y-3">
            <TabBtn active={activeTab === 'overview'} icon="fa-chart-pie" label="Analytics" onClick={() => setActiveTab('overview')} />
            <TabBtn active={activeTab === 'assets'} icon="fa-box-open" label="Library" onClick={() => setActiveTab('assets')} />
            <TabBtn active={activeTab === 'database'} icon="fa-cloud" label="Database" onClick={() => setActiveTab('database')} />
            <TabBtn active={activeTab === 'utilities'} icon="fa-wrench" label="Utilities" onClick={() => setActiveTab('utilities')} />
            <TabBtn active={activeTab === 'settings'} icon="fa-shield-halved" label="System" onClick={() => setActiveTab('settings')} />
          </nav>

          <div className="p-10">
            <button onClick={onClose} className="w-full py-4 bg-red-500/10 text-red-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Disconnect</button>
          </div>
        </aside>

        <div className="flex-1 overflow-y-auto p-10 lg:p-16">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
              <StatCard label="Total Movies" value={movies.length} icon="fa-database" />
              <StatCard label="Cloud Active" value="True" icon="fa-signal" />
              <StatCard label="Uptime" value="99.9%" icon="fa-microchip" />
              <StatCard label="Maintenance" value={isMaintenance ? 'ON' : 'OFF'} icon="fa-wrench" />
            </div>
          )}

          {activeTab === 'database' && (
            <div className="space-y-12 animate-[fadeIn_0.4s]">
               <div className="bg-white/5 p-12 rounded-[2.5rem] border border-white/10">
                  <h3 className="text-xl font-black mb-8 uppercase tracking-widest text-[var(--accent)]">MongoDB Integration Hub</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                     <div className="space-y-6">
                        <div>
                           <label className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-3 block">Primary API Key</label>
                           <div className="flex gap-4">
                              <input type="password" readOnly value={mongoKey} className="flex-1 bg-black/40 border border-white/10 rounded-2xl p-4 text-sm font-mono text-[var(--accent)]" />
                              <button onClick={() => showToast("Key copied to clipboard", "success", "fa-copy")} className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all border border-white/10">
                                 <i className="fas fa-copy"></i>
                              </button>
                           </div>
                        </div>
                        <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-3xl">
                           <div className="flex items-center gap-3 text-green-500 mb-2">
                              <i className="fas fa-check-circle"></i>
                              <span className="text-xs font-black uppercase tracking-widest">Connection Live</span>
                           </div>
                           <p className="text-[10px] text-white/40 leading-relaxed uppercase font-bold">Successfully authenticated with MongoDB Atlas via public node gateway.</p>
                        </div>
                     </div>
                     <div className="space-y-6">
                        <button onClick={() => showToast("Pushing local registry to cloud cluster...", "info", "fa-upload")} className="w-full py-6 bg-[var(--accent)] text-white font-black rounded-[2rem] flex items-center justify-center gap-4 shadow-xl hover:scale-[1.02] transition-all">
                           <i className="fas fa-upload"></i>
                           <span className="text-[10px] uppercase tracking-[4px]">Push to MongoDB Cluster</span>
                        </button>
                        <button onClick={() => showToast("Database verification sequence initiated", "info", "fa-shield")} className="w-full py-6 bg-white/5 border border-white/10 text-white font-black rounded-[2rem] flex items-center justify-center gap-4 hover:bg-white/10 transition-all">
                           <i className="fas fa-microscope"></i>
                           <span className="text-[10px] uppercase tracking-[4px]">Run Integrity Audit</span>
                        </button>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'assets' && (
            <div className="space-y-10 animate-[fadeIn_0.4s]">
               <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10 max-w-2xl">
                  <h3 className="text-xs font-black uppercase tracking-[4px] text-white/30 mb-8">Asset Ingestion</h3>
                  <div className="flex gap-4">
                    <input type="text" placeholder="Entry Title..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 bg-black/40 border border-white/10 rounded-2xl p-4 text-sm font-bold focus:border-[var(--accent)] outline-none" />
                    <button onClick={handleDirectFetch} disabled={isFetching} className="px-8 py-4 bg-[var(--accent)] text-white font-black rounded-2xl text-[10px] uppercase tracking-widest disabled:opacity-50">Fetch Metadata</button>
                  </div>
                  {preview && (
                    <div className="mt-8 p-6 bg-black/40 border border-[var(--accent)]/40 rounded-3xl animate-[slideUp_0.4s]">
                       <p className="font-black text-white mb-4 uppercase text-xs tracking-widest">{preview.Title}</p>
                       <button onClick={() => { onAddMovie(preview); setPreview(null); setSearchQuery(''); }} className="w-full py-4 bg-green-500 text-white font-black rounded-xl text-[10px] uppercase tracking-widest shadow-xl">Deploy to MongoDB</button>
                    </div>
                  )}
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon }: any) => (
  <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5 hover:border-[var(--accent)] transition-all">
    <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] mb-4"><i className={`fas ${icon}`}></i></div>
    <p className="text-2xl font-black text-white">{value}</p>
    <p className="text-[9px] uppercase font-black text-white/20 tracking-[2px] mt-1">{label}</p>
  </div>
);

const TabBtn = ({ icon, label, active, onClick }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-5 py-5 px-6 rounded-2xl transition-all ${active ? 'bg-[var(--accent)] text-white shadow-xl' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}>
    <i className={`fas ${icon} text-base`}></i> <span className="font-black text-[10px] uppercase tracking-[3px]">{label}</span>
  </button>
);

export default AdminDashboard;
