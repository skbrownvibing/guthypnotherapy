import { upsertLog } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json(
    upsertLog({
      date: body.date,
      bm: body.bm,
      bristolType: body.bristolType ?? null,
      bloating: body.bloating,
      pain: body.pain
    })
  );
}
