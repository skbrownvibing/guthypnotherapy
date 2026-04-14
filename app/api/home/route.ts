import { getHomePayload } from '@/lib/api';
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(getHomePayload());
}
