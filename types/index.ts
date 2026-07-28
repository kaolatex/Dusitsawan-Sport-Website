export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: 'sports' | 'announcement' | 'activity';
  imageUrl?: string;
  isFeatured?: boolean;
  isPinned?: boolean;
  pinnedOrder?: number;
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
  isPinned?: boolean;
  pinnedOrder?: number;
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
  isPinned?: boolean;
  pinnedOrder?: number;
}

export type MatchStatus = 'upcoming' | 'live' | 'completed';

export interface MatchSchedule {
  id: string;
  sportId: string;
  sportName: string;
  stage: string; // e.g., "รอบชิงชนะเลิศ", "รอบแรก"
  matchType: 'versus' | 'track';
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
  competitors?: {
    lane: number;
    name: string;
    colorHex: string;
    score?: number;
    place?: number;
  }[];
  status: MatchStatus;
  date: string;
  time: string;
  location: string;
  isPinned?: boolean;
  pinnedOrder?: number;
}

export interface GalleryImage {
  id: string;
  title: string;
  sportName?: string;
  imageUrl: string;
  date: string;
  aspectRatio?: 'portrait' | 'landscape' | 'square';
  isPinned?: boolean;
  pinnedOrder?: number;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface Staff {
  id: string;
  name: string;
  position?: string;
  department?: string;
  contactInfo?: string;
  displayOrder: number;
  imageUrl?: string;
  type?: string;
  isPinned?: boolean;
  pinnedOrder?: number;
}
