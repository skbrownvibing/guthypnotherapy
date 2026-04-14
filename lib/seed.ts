import { Session } from './types';

export const seedSessions: Session[] = [
  {
    id: 'mixed-day1',
    dayNumber: 1,
    track: 'mixed',
    title: 'Core Session 01',
    duration: 18,
    audioUrl: '/audio/core-01.mp3',
    focus: 'Calming abdominal sensitivity',
    kind: 'default'
  },
  {
    id: 'mixed-day2',
    dayNumber: 2,
    track: 'mixed',
    title: 'Core Session 02',
    duration: 17,
    audioUrl: '/audio/core-02.mp3',
    focus: 'Softening bloating and pressure',
    kind: 'default'
  },
  {
    id: 'mixed-short',
    dayNumber: 1,
    track: 'mixed',
    title: 'Short Reset Session',
    duration: 10,
    audioUrl: '/audio/core-04.mp3',
    focus: 'Lower-friction day to rebuild consistency',
    kind: 'short'
  },
  {
    id: 'bloating-core',
    dayNumber: 1,
    track: 'bloating',
    title: 'Bloating Relief Session',
    duration: 17,
    audioUrl: '/audio/core-02.mp3',
    focus: 'Reducing bloating reactivity',
    kind: 'default'
  },
  {
    id: 'constipation-core',
    dayNumber: 1,
    track: 'constipation',
    title: 'Motility Rhythm Session',
    duration: 18,
    audioUrl: '/audio/core-03.mp3',
    focus: 'Supporting steady bowel rhythm',
    kind: 'default'
  },
  {
    id: 'reset-2min',
    dayNumber: 1,
    track: 'mixed',
    title: '2-min Gut Reset',
    duration: 2,
    audioUrl: '/audio/breathing-03.mp3',
    focus: 'Quick downshift for a hard moment',
    kind: 'reset'
  }
];
