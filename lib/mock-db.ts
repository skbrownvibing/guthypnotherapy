import { DailyLog, Profile, Session, UserPlan } from './types';
import { seedSessions } from './seed';

type Store = {
  profiles: Map<string, Profile>;
  dailyLogs: Map<string, DailyLog>;
  plans: Map<string, UserPlan>;
  sessions: Session[];
  onboarding: Map<string, unknown>;
  metrics: {
    logged3DaysUsers: Set<string>;
    sessions3Users: Set<string>;
    day7Users: Set<string>;
  };
};

const globalStore = globalThis as unknown as { gutLoopStore?: Store };

function createStore(): Store {
  return {
    profiles: new Map(),
    dailyLogs: new Map(),
    plans: new Map(),
    sessions: seedSessions,
    onboarding: new Map(),
    metrics: {
      logged3DaysUsers: new Set(),
      sessions3Users: new Set(),
      day7Users: new Set()
    }
  };
}

export const store = globalStore.gutLoopStore ?? createStore();
if (!globalStore.gutLoopStore) {
  globalStore.gutLoopStore = store;
  const demoUser = 'demo-user';
  const today = new Date().toISOString().slice(0, 10);

  store.profiles.set(demoUser, {
    id: demoUser,
    programTrack: 'mixed',
    startDate: today,
    currentDay: 4,
    currentStreak: 3,
    points: 110,
    level: 2
  });

  store.plans.set(`${demoUser}:${today}`, {
    userId: demoUser,
    date: today,
    sessionId: 'mixed-day1',
    completed: false
  });
}

export function dateKey(userId: string, date: string): string {
  return `${userId}:${date}`;
}
