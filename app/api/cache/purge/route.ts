import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  try {
    // Ideally this should be protected with a secret key in production
    // But since this is a specific internal dev tool, we'll allow it for now.
    
    // Purge everything
    revalidatePath('/', 'layout');
    
    return NextResponse.json({ success: true, message: 'Global cache purged successfully' });
  } catch (error) {
    console.error('Error purging cache:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
