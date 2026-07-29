import { NextResponse } from 'next/server';
import { 
  fetchSports, 
  fetchMatches, 
  fetchNews, 
  fetchGallery, 
  fetchStaff,
  fetchAthletes,
  fetchMedals
} from '@/lib/supabase/services';

export const revalidate = 60; // Cache data for 60 seconds globally

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  try {
    let data;
    switch (type) {
      case 'sports':
        data = await fetchSports();
        break;
      case 'matches':
        data = await fetchMatches();
        break;
      case 'news':
        data = await fetchNews();
        break;
      case 'gallery':
        data = await fetchGallery();
        break;
      case 'staff':
        data = await fetchStaff();
        break;
      case 'athletes':
        data = await fetchAthletes();
        break;
      case 'medals':
        data = await fetchMedals();
        break;
      default:
        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error fetching ${type} from Supabase:`, error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
