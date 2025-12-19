
import React from 'react';
import { ThemeType, UserProfile } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeType;
  setTheme: (t: ThemeType) => void;
  onOpenAdmin: () => void;
  onOpenUser: () => void;
  user: UserProfile;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, theme, setTheme, onOpenAdmin, onOpenUser, user }) => {
  const themes: ThemeType[] = ['default', 'day', 'neon', 'amoled', 'glass', 'forest', 'vhs', 'superhero', 'anime'];

  return (
    <>
      <div 
        className={`fixed inset-0 z-[200] bg-black/90 backdrop-blur-2xl transition-opacity duration-700 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      ></div>
      
      <aside 
        className={`
          fixed top-0 right-0 h-full w-full max-w-[380px] z-[201] bg-[#0c0c14] border-l border-white/5
          transition-transform duration-700 ease-[cubic-bezier(0.77,0,0.175,1)]
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          shadow-[-20px_0_60px_rgba(0,0,0,1)] flex flex-col
        `}
      >
        <div className="p-10 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-[10px] font-black uppercase tracking-[6px] text-white/20">System Menu</h2>
            <button onClick={onClose} className="w-10 h-10 hover:bg-white/5 rounded-full flex items-center justify-center">
              <i className="fas fa-times text-sm"></i>
            </button>
          </div>
          
          {/* User Preview */}
          <div 
            onClick={onOpenUser}
            className="flex items-center gap-6 p-6 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-light)] rounded-[2.5rem] cursor-pointer hover:scale-105 transition-all shadow-2xl group"
          >
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-black border border-white/30">
              {user.level}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Cine Member</p>
              <p className="text-xl font-black truncate">{user.name}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-10 space-y-16">
          <section>
            <h3 className="text-[9px] uppercase tracking-[4px] text-white/20 font-black mb-6">Application Modules</h3>
            <div className="space-y-3">
              <NavBtn icon="fa-address-card" label="User Dashboard" onClick={onOpenUser} />
              <NavBtn icon="fa-shield-halved" label="Admin Terminal" onClick={onOpenAdmin} />
            </div>
          </section>

          <section>
            <h3 className="text-[9px] uppercase tracking-[4px] text-white/20 font-black mb-6">Interface Themes</h3>
            <div className="grid grid-cols-2 gap-3">
              {themes.map(t => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`
                    py-4 rounded-2xl border text-[9px] font-black uppercase tracking-[3px] transition-all
                    ${theme === t ? 'bg-[var(--accent)] border-[var(--accent)] text-white shadow-xl' : 'bg-white/5 border-white/10 text-white/30 hover:border-[var(--accent)]'}
                  `}
                >
                  {t}
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="p-10 bg-black/40 border-t border-white/5 text-center">
          <p className="text-[9px] text-white/15 font-black uppercase tracking-[8px]">COMMAND CENTER_BUILD_7X</p>
          <p className="text-[8px] text-white/10 mt-2 font-mono">HASH: 5034-ENTERPRISE-GCM</p>
        </div>
      </aside>
    </>
  );
};

const NavBtn = ({ icon, label, onClick }: any) => (
  <button onClick={onClick} className="w-full flex items-center gap-5 py-5 px-6 rounded-[1.5rem] hover:bg-white/5 group transition-all">
    <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 group-hover:bg-[var(--accent)] group-hover:text-white transition-all shadow-lg">
      <i className={`fas ${icon} text-sm`}></i>
    </div>
    <span className="font-bold text-xs uppercase tracking-[3px]">{label}</span>
  </button>
);

export default Sidebar;
