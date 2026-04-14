import { completeOnboarding } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json(
    completeOnboarding({
      symptoms: body.symptoms ?? [],
      severity: body.severity ?? 5,
      frequency: body.frequency ?? 'varies',
      goals: body.goals ?? []
    })
  );
}
