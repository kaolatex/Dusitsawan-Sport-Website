import type { Tables } from './database.types';
import type {
  Athlete,
  GalleryImage,
  MatchSchedule,
  NewsItem,
  SportCategory,
  SubCategory,
  TeamScore,
} from '@/types';

function parseRules(rules: unknown): string[] {
  if (Array.isArray(rules)) {
    return rules.filter((r): r is string => typeof r === 'string');
  }
  return [];
}

export function mapAthlete(row: Tables<'athletes'>): Athlete {
  return {
    id: row.id,
    name: row.name,
    number: row.number ?? undefined,
    position: row.position ?? undefined,
    team: row.team ?? undefined,
    avatarUrl: row.avatar_url ?? undefined,
  };
}

export function mapMatch(row: Tables<'matches'>): MatchSchedule {
  return {
    id: row.id,
    sportId: row.sport_id ?? '',
    sportName: row.sport_name,
    stage: row.stage,
    teamA: {
      name: row.team_a_name,
      colorHex: row.team_a_color_hex,
      score: row.team_a_score ?? undefined,
    },
    teamB: {
      name: row.team_b_name,
      colorHex: row.team_b_color_hex,
      score: row.team_b_score ?? undefined,
    },
    status: row.status,
    date: row.date,
    time: row.time,
    location: row.location,
  };
}

export function mapNews(row: Tables<'news'>): NewsItem {
  return {
    id: row.id,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    date: row.date,
    category: row.category,
    imageUrl: row.image_url ?? undefined,
    isFeatured: row.is_featured,
  };
}

export function mapGallery(row: Tables<'gallery'>): GalleryImage {
  return {
    id: row.id,
    title: row.title,
    sportName: row.sport_name ?? undefined,
    imageUrl: row.image_url,
    date: row.date,
    aspectRatio: (row.aspect_ratio as GalleryImage['aspectRatio']) ?? undefined,
  };
}

export function mapMedal(row: Tables<'medals'>): TeamScore {
  return {
    id: row.id,
    name: row.name,
    colorName: row.color_name,
    colorHex: row.color_hex,
    gold: row.gold,
    silver: row.silver,
    bronze: row.bronze,
    totalPoints: row.total_points,
  };
}

export function assembleSports(
  sports: Tables<'sports'>[],
  subcategories: Tables<'sport_subcategories'>[],
  athletes: Tables<'athletes'>[]
): SportCategory[] {
  return sports.map(sport => {
    const sportSubs = subcategories
      .filter(sc => sc.sport_id === sport.id)
      .sort((a, b) => a.sort_order - b.sort_order);

    const sportAthletes = athletes
      .filter(a => a.sport_id === sport.id && !a.sub_category_id)
      .map(mapAthlete);

    const subCategories: SubCategory[] = sportSubs.map(sc => ({
      id: sc.id,
      name: sc.name,
      description: sc.description ?? undefined,
      rules: parseRules(sc.rules),
      athletes: athletes
        .filter(a => a.sub_category_id === sc.id)
        .map(mapAthlete),
    }));

    return {
      id: sport.id,
      name: sport.name,
      description: sport.description ?? undefined,
      iconName: sport.icon_name ?? 'Trophy',
      rules: parseRules(sport.rules),
      athletes: sportAthletes.length > 0 ? sportAthletes : undefined,
      subCategories: subCategories.length > 0 ? subCategories : undefined,
    };
  });
}
