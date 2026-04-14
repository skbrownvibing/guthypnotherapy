export type ProgramTrack = 'bloating' | 'constipation' | 'mixed';

export type Session = {
  id: string;
  dayNumber: number;
  track: ProgramTrack;
  title: string;
  duration: number;
  audioUrl: string;
  focus: string;
  kind: 'default' | 'short' | 'reset';
};

export type Profile = {
  id: string;
  programTrack: ProgramTrack;
  startDate: string;
  currentDay: number;
  currentStreak: number;
  points: number;
  level: number;
};

export type DailyLog = {
  userId: string;
  date: string;
  bm: boolean | null;
  bristolType: number | null;
  bloating: number | null;
  pain: number | null;
  sessionCompleted: boolean;
  logPointsAwarded: boolean;
};

export type UserPlan = {
  userId: string;
  date: string;
  sessionId: string;
  completed: boolean;
};
