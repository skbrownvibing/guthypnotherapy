'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type HomeData = {
  week: number;
  day: number;
  streak: number;
  points: number;
  todaySession: { id: string; title: string; duration: number; focus: string };
  lastBM: string;
};

export default function HomePage() {
  const [data, setData] = useState<HomeData | null>(null);
  const [bm, setBm] = useState(true);
  const [bristolType, setBristolType] = useState(4);
  const [bloating, setBloating] = useState(3);
  const [pain, setPain] = useState(3);

  async function loadHome() {
    const response = await fetch('/api/home');
    setData(await response.json());
  }

  useEffect(() => {
    void loadHome();
  }, []);

  async function saveLog() {
    await fetch('/api/logs/upsert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: new Date().toISOString().slice(0, 10),
        bm,
        bristolType,
        bloating,
        pain
      })
    });
    await loadHome();
  }

  if (!data) return <main>Loading...</main>;

  return (
    <main className="space-y-4">
      <section className="space-y-1">
        <p className="text-lg font-semibold">Week {data.week} • Day {data.day}</p>
        <p className="text-sm">🔥 {data.streak} day streak &nbsp;&nbsp; ⭐ {data.points} points</p>
      </section>

      <section className="card space-y-2">
        <Link className="primary-btn block text-center" href="/session">
          Start Today’s Session
        </Link>
        <p className="text-sm">{data.todaySession.duration} min</p>
        <p className="text-sm">Today’s focus: {data.todaySession.focus}</p>
      </section>

      <section className="card space-y-3">
        <p className="text-sm font-semibold">Quick check-in</p>
        <div className="flex gap-2">
          <button className={`secondary-btn ${bm ? 'bg-calm-100' : ''}`} onClick={() => setBm(true)}>
            Yes
          </button>
          <button className={`secondary-btn ${!bm ? 'bg-calm-100' : ''}`} onClick={() => setBm(false)}>
            No
          </button>
        </div>

        {bm && (
          <div className="space-y-1">
            <p className="text-sm">Bristol [1–7]</p>
            <div className="grid grid-cols-7 gap-1">
              {[1, 2, 3, 4, 5, 6, 7].map((value) => (
                <button
                  key={value}
                  className={`secondary-btn px-0 ${bristolType === value ? 'bg-calm-100' : ''}`}
                  onClick={() => setBristolType(value)}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        )}

        <Scale label="Bloating [1–5]" value={bloating} setValue={setBloating} />
        <Scale label="Pain [1–5]" value={pain} setValue={setPain} />

        <button className="primary-btn" onClick={saveLog}>
          Save Log
        </button>

        <div className="space-y-2 pt-2">
          <p className="text-sm">Feeling off?</p>
          <Link href="/session?reset=1" className="secondary-btn inline-block">
            2-min gut reset
          </Link>
        </div>

        <p className="text-sm">Last bowel movement: {data.lastBM}</p>
      </section>
    </main>
  );
}

function Scale({ label, value, setValue }: { label: string; value: number; setValue: (value: number) => void }) {
  return (
    <div>
      <p className="mb-1 text-sm">{label}</p>
      <div className="grid grid-cols-5 gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} onClick={() => setValue(n)} className={`secondary-btn px-0 ${value === n ? 'bg-calm-100' : ''}`}>
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}
