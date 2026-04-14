import { Session } from './types';

export function pickAdaptiveSession(params: {
  sessions: Session[];
  daysSinceBM: number | null;
  avgBloatingLast3: number | null;
  missedLast2Sessions: boolean;
  defaultSession: Session;
}): Session {
  const { sessions, daysSinceBM, avgBloatingLast3, missedLast2Sessions, defaultSession } = params;

  if (daysSinceBM !== null && daysSinceBM >= 2) {
    return sessions.find((session) => session.track === 'constipation' && session.kind === 'default') ?? defaultSession;
  }

  if (avgBloatingLast3 !== null && avgBloatingLast3 >= 4) {
    return sessions.find((session) => session.track === 'bloating' && session.kind === 'default') ?? defaultSession;
  }

  if (missedLast2Sessions) {
    return sessions.find((session) => session.kind === 'short') ?? defaultSession;
  }

  return defaultSession;
}
