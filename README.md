# GutLoop MVP

GutLoop is a mobile-first web app for an 8-week gut hypnotherapy protocol.

Core loop: **Log → Session → See progress → Repeat**.

## Scope implemented

- 5-step onboarding (symptoms, severity, frequency, goals)
- Home screen with one-tap session CTA
- Daily log: BM, Bristol (if BM), bloating, pain
- Session flow with 2-min breathing intro concept + optional 2-min reset
- Points + streaks (+20 session, +10 log, 3/7 day bonuses)
- Progress charts (bloating, pain) + BM history
- Weekly summary text block
- Basic adaptive plan rules:
  - daysSinceBM >= 2 → constipation session
  - avgBloatingLast3 >= 4 → bloating session
  - missedLast2Sessions → short session
  - otherwise default session

## API endpoints

- `POST /api/onboarding/complete`
- `GET /api/home`
- `POST /api/logs/upsert`
- `POST /api/session/complete`
- `GET /api/progress`
- `GET /api/weekly-summary`
- `POST /api/plan/refresh`

## Success metrics tracked (in-memory)

- users who logged >=3 days
- users who completed >=3 sessions
- day-7 retention users

## SQL

- `db/schema.sql`
- `db/seed_sessions.sql`
