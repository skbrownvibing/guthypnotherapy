import { pickAdaptiveSession } from './adaptive-plan';
import { calculateLevel, POINTS } from './gamification';
import { dateKey, store } from './mock-db';
import { deriveTrack, sessionForDay } from './program';

export const DEMO_USER_ID = 'demo-user';

function parseDate(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`);
}

function formatDaysAgo(days: number | null): string {
  if (days === null) return 'No BM logged yet';
  if (days === 0) return 'today';
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}

function daysSinceLastBM(userId: string, today: string): number | null {
  const bmDates = Array.from(store.dailyLogs.values())
    .filter((log) => log.userId === userId && log.bm)
    .map((log) => log.date)
    .sort();

  const last = bmDates.at(-1);
  if (!last) return null;

  const diffMs = parseDate(today).getTime() - parseDate(last).getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

function avgBloatingLast3(userId: string): number | null {
  const values = Array.from(store.dailyLogs.values())
    .filter((log) => log.userId === userId && log.bloating !== null)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-3)
    .map((log) => Number(log.bloating));

  if (!values.length) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function missedLast2Sessions(userId: string): boolean {
  const lastTwoPlans = Array.from(store.plans.values())
    .filter((plan) => plan.userId === userId)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-2);

  return lastTwoPlans.length === 2 && lastTwoPlans.every((plan) => !plan.completed);
}

function updateMetricSets(userId: string) {
  const userLogs = Array.from(store.dailyLogs.values()).filter((log) => log.userId === userId);
  const completedSessions = Array.from(store.plans.values()).filter((plan) => plan.userId === userId && plan.completed).length;
  const profile = store.profiles.get(userId);

  if (userLogs.length >= 3) store.metrics.logged3DaysUsers.add(userId);
  if (completedSessions >= 3) store.metrics.sessions3Users.add(userId);
  if (profile && profile.currentDay >= 7) store.metrics.day7Users.add(userId);
}

export function completeOnboarding(input: {
  symptoms: string[];
  severity: number;
  frequency: string;
  goals: string[];
}) {
  const userId = DEMO_USER_ID;
  const track = deriveTrack(input.symptoms);
  const today = new Date().toISOString().slice(0, 10);
  const session = sessionForDay(track, store.sessions, 1);

  store.profiles.set(userId, {
    id: userId,
    programTrack: track,
    startDate: today,
    currentDay: 1,
    currentStreak: 0,
    points: 0,
    level: 1
  });
  store.onboarding.set(userId, input);
  store.plans.set(dateKey(userId, today), {
    userId,
    date: today,
    sessionId: session.id,
    completed: false
  });

  return {
    success: true,
    programTrack: track,
    currentDay: 1,
    todaySession: {
      id: session.id,
      title: session.title,
      duration: session.duration,
      audioUrl: session.audioUrl,
      focus: session.focus
    }
  };
}

export function getHomePayload() {
  const user = store.profiles.get(DEMO_USER_ID);
  if (!user) throw new Error('Profile missing');

  const today = new Date().toISOString().slice(0, 10);
  const plan = store.plans.get(dateKey(DEMO_USER_ID, today));
  const session = store.sessions.find((item) => item.id === plan?.sessionId) ?? sessionForDay(user.programTrack, store.sessions, user.currentDay);
  const lastBM = daysSinceLastBM(DEMO_USER_ID, today);

  return {
    week: Math.ceil(user.currentDay / 7),
    day: user.currentDay,
    streak: user.currentStreak,
    points: user.points,
    todaySession: {
      id: session.id,
      title: session.title,
      duration: session.duration,
      audioUrl: session.audioUrl,
      focus: session.focus
    },
    lastBM: formatDaysAgo(lastBM)
  };
}

export function upsertLog(input: {
  date: string;
  bm: boolean;
  bristolType: number | null;
  bloating: number;
  pain: number;
}) {
  const user = store.profiles.get(DEMO_USER_ID);
  if (!user) throw new Error('Profile missing');

  const key = dateKey(DEMO_USER_ID, input.date);
  const existing = store.dailyLogs.get(key);

  store.dailyLogs.set(key, {
    userId: DEMO_USER_ID,
    date: input.date,
    bm: input.bm,
    bristolType: input.bm ? input.bristolType : null,
    bloating: input.bloating,
    pain: input.pain,
    sessionCompleted: existing?.sessionCompleted ?? false,
    logPointsAwarded: true
  });

  const pointsAwarded = existing?.logPointsAwarded ? 0 : POINTS.dailyLog;
  if (pointsAwarded > 0) {
    user.points += pointsAwarded;
    user.level = calculateLevel(user.points);
    store.profiles.set(DEMO_USER_ID, user);
  }

  updateMetricSets(DEMO_USER_ID);
  return { success: true, pointsAwarded, totalPoints: user.points };
}

export function completeSession(input: { date: string }) {
  const user = store.profiles.get(DEMO_USER_ID);
  if (!user) throw new Error('Profile missing');

  const key = dateKey(DEMO_USER_ID, input.date);
  const plan = store.plans.get(key);
  if (!plan) throw new Error('No plan found');
  if (plan.completed) {
    return { success: true, pointsAwarded: 0, streak: user.currentStreak, totalPoints: user.points };
  }

  plan.completed = true;
  store.plans.set(key, plan);

  const existing = store.dailyLogs.get(key);
  store.dailyLogs.set(key, {
    userId: DEMO_USER_ID,
    date: input.date,
    bm: existing?.bm ?? null,
    bristolType: existing?.bristolType ?? null,
    bloating: existing?.bloating ?? null,
    pain: existing?.pain ?? null,
    sessionCompleted: true,
    logPointsAwarded: existing?.logPointsAwarded ?? false
  });

  let pointsAwarded = POINTS.sessionComplete;
  user.currentStreak += 1;
  user.currentDay += 1;
  if (user.currentStreak === 3) pointsAwarded += POINTS.streak3Bonus;
  if (user.currentStreak === 7) pointsAwarded += POINTS.streak7Bonus;
  user.points += pointsAwarded;
  user.level = calculateLevel(user.points);
  store.profiles.set(DEMO_USER_ID, user);

  updateMetricSets(DEMO_USER_ID);
  return { success: true, pointsAwarded, streak: user.currentStreak, totalPoints: user.points };
}

export function progressPayload() {
  const logs = Array.from(store.dailyLogs.values())
    .filter((log) => log.userId === DEMO_USER_ID)
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    bloatingTrend: logs.filter((log) => log.bloating !== null).map((log) => ({ date: log.date, value: log.bloating })),
    painTrend: logs.filter((log) => log.pain !== null).map((log) => ({ date: log.date, value: log.pain })),
    bmHistory: logs.map((log) => ({ date: log.date, bm: Boolean(log.bm), bristolType: log.bristolType }))
  };
}

export function weeklySummaryPayload() {
  const logs = Array.from(store.dailyLogs.values())
    .filter((log) => log.userId === DEMO_USER_ID)
    .sort((a, b) => a.date.localeCompare(b.date));

  const sessionDays = logs.filter((log) => log.sessionCompleted);
  const nonSessionDays = logs.filter((log) => !log.sessionCompleted);

  const avg = (values: number[]) => (values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0);

  const bloatingSessionAvg = avg(sessionDays.map((log) => log.bloating ?? 0));
  const bloatingNonSessionAvg = avg(nonSessionDays.map((log) => log.bloating ?? 0));

  return {
    header: 'Let’s see how your gut did this week',
    loggedDays: logs.length,
    bloatingSummary: bloatingSessionAvg < bloatingNonSessionAvg ? 'slightly improved' : 'flat',
    painSummary: 'flat',
    bowelMovementDays: logs.filter((log) => log.bm).length,
    highlights: [
      'Symptoms were lower on days you completed a session',
      'You were most consistent earlier in the week'
    ],
    nextStep: 'Try completing 3 sessions in a row'
  };
}

export function refreshPlan() {
  const user = store.profiles.get(DEMO_USER_ID);
  if (!user) throw new Error('Profile missing');

  const today = new Date().toISOString().slice(0, 10);
  const defaultSession = sessionForDay(user.programTrack, store.sessions, user.currentDay);

  const session = pickAdaptiveSession({
    sessions: store.sessions,
    daysSinceBM: daysSinceLastBM(DEMO_USER_ID, today),
    avgBloatingLast3: avgBloatingLast3(DEMO_USER_ID),
    missedLast2Sessions: missedLast2Sessions(DEMO_USER_ID),
    defaultSession
  });

  store.plans.set(dateKey(DEMO_USER_ID, today), {
    userId: DEMO_USER_ID,
    date: today,
    sessionId: session.id,
    completed: false
  });

  return {
    id: session.id,
    title: session.title,
    duration: session.duration,
    focus: session.focus,
    audioUrl: session.audioUrl
  };
}

export function retentionMetrics() {
  return {
    usersLoggedAtLeast3Days: store.metrics.logged3DaysUsers.size,
    usersCompletedAtLeast3Sessions: store.metrics.sessions3Users.size,
    day7RetentionUsers: store.metrics.day7Users.size
  };
}
