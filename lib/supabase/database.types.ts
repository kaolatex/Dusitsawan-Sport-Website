export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      sports: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          icon_name: string | null;
          rules: Json;
          sort_order: number;
          is_pinned: boolean;
          pinned_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          icon_name?: string | null;
          rules?: Json;
          sort_order?: number;
          is_pinned?: boolean;
          pinned_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          icon_name?: string | null;
          rules?: Json;
          sort_order?: number;
          is_pinned?: boolean;
          pinned_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      sport_subcategories: {
        Row: {
          id: string;
          sport_id: string;
          name: string;
          description: string | null;
          rules: Json;
          sort_order: number;
        };
        Insert: {
          id?: string;
          sport_id: string;
          name: string;
          description?: string | null;
          rules?: Json;
          sort_order?: number;
        };
        Update: {
          id?: string;
          sport_id?: string;
          name?: string;
          description?: string | null;
          rules?: Json;
          sort_order?: number;
        };
        Relationships: [];
      };
      athletes: {
        Row: {
          id: string;
          sport_id: string | null;
          sub_category_id: string | null;
          name: string;
          number: string | null;
          position: string | null;
          team: string | null;
          avatar_url: string | null;
          is_pinned: boolean;
          pinned_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          sport_id?: string | null;
          sub_category_id?: string | null;
          name: string;
          number?: string | null;
          position?: string | null;
          team?: string | null;
          avatar_url?: string | null;
          is_pinned?: boolean;
          pinned_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          sport_id?: string | null;
          sub_category_id?: string | null;
          name?: string;
          number?: string | null;
          position?: string | null;
          team?: string | null;
          avatar_url?: string | null;
          is_pinned?: boolean;
          pinned_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      matches: {
        Row: {
          id: string;
          sport_id: string | null;
          sport_name: string;
          stage: string;
          match_type: 'versus' | 'track';
          team_a_name: string;
          team_a_color_hex: string;
          team_a_score: number | null;
          team_b_name: string;
          team_b_color_hex: string;
          team_b_score: number | null;
          competitors: Json | null;
          status: 'upcoming' | 'live' | 'completed';
          date: string;
          time: string;
          location: string;
          is_pinned: boolean;
          pinned_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          sport_id?: string | null;
          sport_name: string;
          stage: string;
          match_type?: 'versus' | 'track';
          team_a_name: string;
          team_a_color_hex: string;
          team_a_score?: number | null;
          team_b_name: string;
          team_b_color_hex: string;
          team_b_score?: number | null;
          competitors?: Json | null;
          status: 'upcoming' | 'live' | 'completed';
          date: string;
          time: string;
          location: string;
          is_pinned?: boolean;
          pinned_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          sport_id?: string | null;
          sport_name?: string;
          stage?: string;
          match_type?: 'versus' | 'track';
          team_a_name?: string;
          team_a_color_hex?: string;
          team_a_score?: number | null;
          team_b_name?: string;
          team_b_color_hex?: string;
          team_b_score?: number | null;
          competitors?: Json | null;
          status?: 'upcoming' | 'live' | 'completed';
          date?: string;
          time?: string;
          location?: string;
          is_pinned?: boolean;
          pinned_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      news: {
        Row: {
          id: string;
          title: string;
          excerpt: string;
          content: string;
          date: string;
          category: 'sports' | 'announcement' | 'activity';
          image_url: string | null;
          is_featured: boolean;
          is_pinned: boolean;
          pinned_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          excerpt: string;
          content: string;
          date: string;
          category: 'sports' | 'announcement' | 'activity';
          image_url?: string | null;
          is_featured?: boolean;
          is_pinned?: boolean;
          pinned_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          excerpt?: string;
          content?: string;
          date?: string;
          category?: 'sports' | 'announcement' | 'activity';
          image_url?: string | null;
          is_featured?: boolean;
          is_pinned?: boolean;
          pinned_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      gallery: {
        Row: {
          id: string;
          title: string;
          sport_name: string | null;
          image_url: string;
          date: string;
          aspect_ratio: string | null;
          is_pinned: boolean;
          pinned_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          sport_name?: string | null;
          image_url: string;
          date: string;
          aspect_ratio?: string | null;
          is_pinned?: boolean;
          pinned_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          sport_name?: string | null;
          image_url?: string;
          date?: string;
          aspect_ratio?: string | null;
          is_pinned?: boolean;
          pinned_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      medals: {
        Row: {
          id: string;
          name: string;
          color_name: string;
          color_hex: string;
          gold: number;
          silver: number;
          bronze: number;
          total_points: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          color_name: string;
          color_hex: string;
          gold?: number;
          silver?: number;
          bronze?: number;
          total_points?: number;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          color_name?: string;
          color_hex?: string;
          gold?: number;
          silver?: number;
          bronze?: number;
          total_points?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      staff: {
        Row: {
          id: string;
          name: string;
          position: string | null;
          department: string | null;
          contact_info: string | null;
          display_order: number;
          image_url: string | null;
          type: string | null;
          is_pinned: boolean;
          pinned_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          position?: string | null;
          department?: string | null;
          contact_info?: string | null;
          display_order?: number;
          image_url?: string | null;
          type?: string | null;
          is_pinned?: boolean;
          pinned_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          position?: string | null;
          department?: string | null;
          contact_info?: string | null;
          display_order?: number;
          image_url?: string | null;
          type?: string | null;
          is_pinned?: boolean;
          pinned_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      cheer_wall: {
        Row: {
          id: string;
          author_name: string;
          message: string;
          sticker_id: string | null;
          is_anonymous: boolean;
          status: 'approved' | 'pending' | 'flagged';
          is_pinned: boolean;
          pinned_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          author_name?: string;
          message: string;
          sticker_id?: string | null;
          is_anonymous?: boolean;
          status?: 'approved' | 'pending' | 'flagged';
          is_pinned?: boolean;
          pinned_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          author_name?: string;
          message?: string;
          sticker_id?: string | null;
          is_anonymous?: boolean;
          status?: 'approved' | 'pending' | 'flagged';
          is_pinned?: boolean;
          pinned_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          id: string;
          announcement_text: string | null;
          is_announcement_active: boolean;
          event_date: string | null;
          is_countdown_active: boolean;
          show_countdown_on_home: boolean;
          show_medals_on_home: boolean;
          show_cheer_on_home: boolean;
          is_photo_wall_paused: boolean;
          page_views: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          announcement_text?: string | null;
          is_announcement_active?: boolean;
          event_date?: string | null;
          is_countdown_active?: boolean;
          show_countdown_on_home?: boolean;
          show_medals_on_home?: boolean;
          show_cheer_on_home?: boolean;
          is_photo_wall_paused?: boolean;
          page_views?: number;
          updated_at?: string;
        };
        Update: {
          id?: string;
          announcement_text?: string | null;
          is_announcement_active?: boolean;
          event_date?: string | null;
          is_countdown_active?: boolean;
          show_countdown_on_home?: boolean;
          show_medals_on_home?: boolean;
          show_cheer_on_home?: boolean;
          is_photo_wall_paused?: boolean;
          page_views?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      increment_page_view: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];
