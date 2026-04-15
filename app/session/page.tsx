'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

type HomeData = {
  todaySession: { id: string; title: string; duration: number; audioUrl: string; focus: string };
};

function SessionContent() {
  const searchParams = useSearchParams();
  const resetOnly = searchParams.get('reset') === '1';
  const [session, setSession] = useState<HomeData['todaySession'] | null>(null);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    fetch('/api/home')
      .then((response) => response.json())
      .then((data: HomeData) => {
        if (resetOnly) {
          setSession({
            id: 'reset-2min',
            title: '2-min Gut Reset',
            duration: 2,
            audioUrl: '/audio/breathing-03.mp3',
            focus: 'Short reset to calm your gut-brain loop'
          });
        } else {
          setSession(data.todaySession);
        }
      });
  }, [resetOnly]);

  async function markComplete() {
    if (!resetOnly) {
      await fetch('/api/session/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: new Date().toISOString().slice(0, 10) })
      });
    }
    setComplete(true);
  }

  if (!session) return <main>Loading...</main>;

  return (
    <main className="space-y-4">
      <section className="card space-y-2">
        <h1 className="text-xl font-semibold">{session.title}</h1>
        <p className="text-sm">{session.duration} min</p>
        <p className="text-sm">Starts with 2-minute breathing intro, then guided hypnotherapy.</p>
        <p className="text-sm">Today's focus: {session.focus}</p>
        <audio controls className="w-full">
          <source src={session.audioUrl} />
        </audio>
        <button className="primary-btn" onClick={markComplete}>
          Mark Complete
        </button>
      </section>

      {complete && (
        <section className="card space-y-2">
          <p className="text-lg font-semibold">Session complete</p>
          {!resetOnly && <p className="text-sm">+20 points, streak updated.</p>}
          <Link href="/home" className="secondary-btn inline-block">
            Back to Home
          </Link>
        </section>
      )}
    </main>
  );
}

export default function SessionPage() {
  return (
    <Suspense fallback={<main>Loading...</main>}>
      <SessionContent />
    </Suspense>
  );
}
