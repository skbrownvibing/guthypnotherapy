import Link from 'next/link';

export default function WelcomePage() {
  return (
    <main className="flex min-h-screen flex-col justify-center gap-6">
      <div className="space-y-3">
        <h1 className="text-4xl font-semibold text-calm-900">GutLoop</h1>
        <h2 className="text-2xl font-medium text-calm-700">Calm your gut. Train your nervous system.</h2>
        <p className="text-sm text-slate-600">
          GutLoop is a structured 8-week program designed to help you reduce symptoms through guided breathing,
          gut-directed hypnotherapy, and daily progress tracking.
        </p>
      </div>

      <Link className="primary-btn text-center" href="/onboarding">
        Start Program
      </Link>

      <p className="text-center text-sm text-slate-600">
        Already have an account? <span className="font-medium text-calm-700">Sign in</span>
      </p>
    </main>
  );
}
