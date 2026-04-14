import { ProgramTrack, Session } from './types';

export function deriveTrack(symptoms: string[]): ProgramTrack {
  if (symptoms.includes('bloating') && symptoms.length === 1) return 'bloating';
  if (symptoms.includes('constipation') && !symptoms.includes('bloating')) return 'constipation';
  return 'mixed';
}

export function sessionForDay(track: ProgramTrack, sessions: Session[], day: number): Session {
  return (
    sessions.find((session) => session.track === track && session.dayNumber === day && session.kind === 'default') ??
    sessions.find((session) => session.track === track && session.kind === 'default') ??
    sessions[0]
  );
}
