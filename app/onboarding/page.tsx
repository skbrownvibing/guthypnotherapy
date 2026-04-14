'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const symptomOptions = ['bloating', 'constipation', 'diarrhea', 'abdominal_pain', 'irregular_bowel_movements'] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [symptoms, setSymptoms] = useState<string[]>(['bloating']);
  const [severity, setSeverity] = useState(5);
  const [frequency, setFrequency] = useState('most_days');
  const [goals, setGoals] = useState<string[]>(['less_bloating']);

  async function finish() {
    await fetch('/api/onboarding/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symptoms, severity, frequency, goals })
    });

    router.push('/home');
  }

  return (
    <main className="space-y-4">
      <p className="text-sm">Step {step} of 5</p>

      {step === 1 && (
        <section className="card space-y-3">
          <h1 className="text-lg font-semibold">What symptoms are most common for you?</h1>
          {symptomOptions.map((option) => (
            <label key={option} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={symptoms.includes(option)}
                onChange={(event) => {
                  if (event.target.checked) setSymptoms((current) => [...current, option]);
                  else setSymptoms((current) => current.filter((item) => item !== option));
                }}
              />
              {option.replaceAll('_', ' ')}
            </label>
          ))}
          <button className="primary-btn" onClick={() => setStep(2)}>Continue</button>
        </section>
      )}

      {step === 2 && (
        <section className="card space-y-3">
          <h1 className="text-lg font-semibold">How much are your symptoms affecting you lately?</h1>
          <input type="range" min={1} max={10} value={severity} onChange={(e) => setSeverity(Number(e.target.value))} className="w-full" />
          <p className="text-sm">Severity: {severity}/10</p>
          <button className="primary-btn" onClick={() => setStep(3)}>Continue</button>
        </section>
      )}

      {step === 3 && (
        <section className="card space-y-2">
          <h1 className="text-lg font-semibold">How often do symptoms show up?</h1>
          {['most_days', 'few_times_week', 'around_meals', 'during_stress', 'varies'].map((option) => (
            <button
              key={option}
              onClick={() => setFrequency(option)}
              className={`secondary-btn block w-full text-left ${frequency === option ? 'bg-calm-100' : ''}`}
            >
              {option.replaceAll('_', ' ')}
            </button>
          ))}
          <button className="primary-btn" onClick={() => setStep(4)}>Continue</button>
        </section>
      )}

      {step === 4 && (
        <section className="card space-y-2">
          <h1 className="text-lg font-semibold">What would you most like to improve?</h1>
          <p className="text-sm">Choose up to 2 goals.</p>
          {['less_bloating', 'more_regular_bm', 'less_pain', 'less_urgency', 'more_calm'].map((goal) => (
            <label key={goal} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={goals.includes(goal)}
                onChange={(event) => {
                  if (event.target.checked && goals.length < 2) setGoals((current) => [...current, goal]);
                  if (!event.target.checked) setGoals((current) => current.filter((item) => item !== goal));
                }}
              />
              {goal.replaceAll('_', ' ')}
            </label>
          ))}
          <button className="primary-btn" onClick={() => setStep(5)}>Continue</button>
        </section>
      )}

      {step === 5 && (
        <section className="card space-y-3">
          <h1 className="text-lg font-semibold">Your program is ready</h1>
          <p className="text-sm">8 weeks. Daily repetition. Keep it simple and consistent.</p>
          <button className="primary-btn" onClick={finish}>Start My Program</button>
        </section>
      )}
    </main>
  );
}
