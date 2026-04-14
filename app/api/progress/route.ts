import { progressPayload } from '@/lib/api';
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(progressPayload());
}
