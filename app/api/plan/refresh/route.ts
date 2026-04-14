import { refreshPlan } from '@/lib/api';
import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(refreshPlan());
}
