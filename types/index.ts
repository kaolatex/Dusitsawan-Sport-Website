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

export interface CheerMessage {
  id: string;
  name: string;
  message: string;
  is_pinned?: boolean;
  pinned_order?: number;
  created_at: string;
}

export interface SiteSettings {
  id: string;
  is_announcement_active: boolean;
  announcement_text?: string;
  is_countdown_active: boolean;
  event_date?: string;
  show_medals_on_home: boolean;
  show_news_on_home: boolean;
  show_matches_on_home: boolean;
  is_photo_wall_paused?: boolean;
}

export interface PhotoWallPost {
  id: string;
  image_url: string;
  uploader_name?: string;
  caption?: string;
  status: 'pending' | 'approved' | 'rejected';
  likes_count: number;
  is_pinned: boolean;
  created_at: string;
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
