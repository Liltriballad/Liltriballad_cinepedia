
import React, { useState } from 'react';
import { ThemeType } from '../types';

interface ThemeToggleProps {
  theme: ThemeType;
  setTheme: (t: ThemeType) => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, setTheme }) => {
  const themes: ThemeType[] = ['default', 'day', 'neon', 'amoled', 'glass', 'forest', 'vhs', 'superhero', 'anime'];
  const [isAnimating, setIsAnimating] = useState(false);
  
  const cycleTheme = () => {
    setIsAnimating(true);
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
    // Animation lockout period for smooth feel
    setTimeout(() => setIsAnimating(false), 300);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'default': return 'fa-moon';
      case 'day': return 'fa-sun';
      case 'neon': return 'fa-bolt';
      case 'amoled': return 'fa-eye-slash';
      case 'glass': return 'fa-wind';
      case 'forest': return 'fa-leaf';
      case 'vhs': return 'fa-tv';
      case 'superhero': return 'fa-shield-halved';
      case 'anime': return 'fa-star';
      default: return 'fa-magic';
    }
  };

  const getAnimationClass = () => {
    switch (theme) {
      case 'default': return 'animate-lunar-drift';
      case 'day': return 'animate-spin-slow';
      case 'neon': return 'animate-pulse-glow';
      case 'amoled': return 'animate-stealth';
      case 'glass': return 'animate-float-slow';
      case 'forest': return 'animate-sway';
      case 'vhs': return 'animate-glitch-icon';
      case 'superhero': return 'animate-bounce-short';
      case 'anime': return 'animate-twinkle';
      default: return '';
    }
  };

  return (
    <>
      <style>{`
        @keyframes lunar-drift {
          0%, 100% { 
            transform: translateY(0) rotate(-15deg) scale(1); 
            filter: drop-shadow(0 0 8px var(--accent)) brightness(1); 
          }
          50% { 
            transform: translateY(-8px) rotate(35deg) scale(1.15); 
            filter: drop-shadow(0 0 18px var(--accent)) brightness(1.6); 
          }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { filter: drop-shadow(0 0 2px var(--accent)); transform: scale(1); }
          50% { filter: drop-shadow(0 0 10px var(--accent)); transform: scale(1.1); }
        }
        @keyframes stealth {
          0%, 100% { opacity: 1; filter: blur(0px); }
          50% { opacity: 0.3; filter: blur(1px); }
        }
        @keyframes sway {
          0%, 100% { transform: rotate(-15deg) translateY(0); }
          50% { transform: rotate(15deg) translateY(-2px); }
        }
        @keyframes glitch-icon {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }
        @keyframes twinkle {
          0%, 100% { transform: scale(1) rotate(0); opacity: 1; }
          50% { transform: scale(1.3) rotate(15deg); opacity: 0.7; }
        }
        .animate-lunar-drift { animation: lunar-drift 4s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .animate-stealth { animation: stealth 4s ease-in-out infinite; }
        .animate-sway { animation: sway 3s ease-in-out infinite; }
        .animate-glitch-icon { animation: glitch-icon 0.3s infinite; }
        .animate-bounce-short { animation: bounce 1s infinite; }
        .animate-twinkle { animation: twinkle 1.5s ease-in-out infinite; }
      `}</style>
      <button
        onClick={cycleTheme}
        className={`
          relative w-12 h-12 flex items-center justify-center rounded-full 
          bg-white/10 border border-[var(--accent)] overflow-hidden group
          transition-all duration-700 hover:shadow-[0_0_25px_var(--accent)]
          active:scale-90
        `}
        title="Cycle Immersive Themes"
      >
        <div className={`relative transition-all duration-300 z-10 ${getAnimationClass()}`}>
          <i className={`fas ${getThemeIcon()} text-xl text-[var(--accent)]`}></i>
        </div>
        
        {/* Dynamic background pulse */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[var(--accent)] to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-700"></div>
      </button>
    </>
  );
};

export default ThemeToggle;
