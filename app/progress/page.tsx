'use client';

import { TrendChart } from '@/components/TrendChart';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type ProgressData = {
  bloatingTrend: { date: string; value: number }[];
  painTrend: { date: string; value: number }[];
  bmHistory: { date: string; bm: boolean }[];
};

export default function ProgressPage() {
  const [data, setData] = useState<ProgressData | null>(null);

  useEffect(() => {
    fetch('/api/progress')
      .then((response) => response.json())
      .then(setData);
  }, []);

  if (!data) return <main>Loading...</main>;

  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-semibold">Progress</h1>

      <section className="card">
        <TrendChart data={data.bloatingTrend} color="#2e7373" dataKey="value" label="Bloating trend" />
      </section>

      <section className="card">
        <TrendChart data={data.painTrend} color="#205253" dataKey="value" label="Pain trend" />
      </section>

      <section className="card text-sm">
        <p className="mb-2 font-medium">BM history</p>
        <div className="grid grid-cols-7 gap-1">
          {data.bmHistory.slice(-7).map((entry) => (
            <div key={entry.date} className="rounded bg-calm-100 p-2 text-center">
              {entry.bm ? '✓' : '-'}
            </div>
          ))}
        </div>
      </section>

      <Link href="/weekly-summary" className="primary-btn block text-center">
        Weekly summary
      </Link>
    </main>
  );
}
