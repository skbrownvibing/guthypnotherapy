'use client';

import { useEffect, useState } from 'react';

type WeeklySummary = {
  header: string;
  loggedDays: number;
  bloatingSummary: string;
  painSummary: string;
  bowelMovementDays: number;
  highlights: string[];
  nextStep: string;
};

export default function WeeklySummaryPage() {
  const [data, setData] = useState<WeeklySummary | null>(null);

  useEffect(() => {
    fetch('/api/weekly-summary')
      .then((response) => response.json())
      .then(setData);
  }, []);

  if (!data) return <main>Loading...</main>;

  return (
    <main className="space-y-4">
      <h1 className="text-xl font-semibold">{data.header}</h1>

      <section className="card text-sm space-y-1">
        <p>You logged {data.loggedDays} days</p>
        <p>Bloating: {data.bloatingSummary}</p>
        <p>Pain: {data.painSummary}</p>
        <p>Bowel movements: {data.bowelMovementDays} days</p>
      </section>

      <section className="card text-sm space-y-2">
        <p className="font-medium">What stands out:</p>
        <ul className="list-disc pl-5">
          {data.highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="card text-sm">
        <p>Next step: {data.nextStep}</p>
      </section>
    </main>
  );
}
