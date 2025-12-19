
export interface Movie {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
  imdbRating?: string;
  Genre?: string;
  Plot?: string;
  VideoURL?: string;
  DownloadURL?: string;
  imdbVotes?: string;
  Director?: string;
  Actors?: string;
  BoxOffice?: string;
}

export type ThemeType = 'default' | 'day' | 'neon' | 'amoled' | 'glass' | 'forest' | 'vhs' | 'superhero' | 'anime';

// Added TimelineItem and UserProfile interfaces to fix the import error in UserDashboard.tsx
export interface TimelineItem {
  id: string | number;
  title: string;
  meta: string;
}

export interface UserProfile {
  name: string;
  level: number;
  xp: number;
  xpToNext: number;
  watchlist: string[];
  badges: string[];
  history: string[];
  timeline: TimelineItem[];
  searchHistory: string[];
}
