export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: 'sports' | 'announcement' | 'activity';
  imageUrl?: string;
  isFeatured?: boolean;
}

export interface TeamScore {
  id: string;
  name: string;
  colorName: string;
  colorHex: string;
  gold: number;
  silver: number;
  bronze: number;
  totalPoints: number;
}

export interface Athlete {
  id: string;
  name: string;
  number?: string;
  position?: string;
  team?: string;
  avatarUrl?: string;
}

export interface SubCategory {
  id: string;
  name: string;
  description?: string;
  rules?: string[];
  athletes?: Athlete[];
}

export interface SportCategory {
  id: string;
  name: string;
  description?: string;
  iconName?: string; // Used to dynamic render Lucide icon
  rules?: string[];
  subCategories?: SubCategory[];
  athletes?: Athlete[];
}

export type MatchStatus = 'upcoming' | 'live' | 'completed';

export interface MatchSchedule {
  id: string;
  sportId: string;
  sportName: string;
  stage: string; // e.g., "รอบชิงชนะเลิศ", "รอบแรก"
  teamA: {
    name: string;
    colorHex: string;
    score?: number;
  };
  teamB: {
    name: string;
    colorHex: string;
    score?: number;
  };
  status: MatchStatus;
  date: string;
  time: string;
  location: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  sportName?: string;
  imageUrl: string;
  date: string;
  aspectRatio?: 'portrait' | 'landscape' | 'square';
}

export interface NavItem {
  label: string;
  href: string;
}
