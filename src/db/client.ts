import { sql } from 'bun'
import type { DailySleep } from '@/types'

const upsertSleepRecord = async (sleep: DailySleep) => {
  await sql`
    INSERT INTO daily_sleep (
      id, day, score, timestamp,
      deep_sleep, efficiency, latency, rem_sleep,
      restfulness, timing, total_sleep, updated_at
    ) VALUES (
      ${sleep.id},
      ${sleep.day},
      ${sleep.score},
      ${sleep.timestamp},
      ${sleep.contributors.deep_sleep},
      ${sleep.contributors.efficiency},
      ${sleep.contributors.latency},
      ${sleep.contributors.rem_sleep},
      ${sleep.contributors.restfulness},
      ${sleep.contributors.timing},
      ${sleep.contributors.total_sleep},
      CURRENT_TIMESTAMP
    )
    ON CONFLICT (id) DO UPDATE SET
      day = EXCLUDED.day,
      score = EXCLUDED.score,
      timestamp = EXCLUDED.timestamp,
      deep_sleep = EXCLUDED.deep_sleep,
      efficiency = EXCLUDED.efficiency,
      latency = EXCLUDED.latency,
      rem_sleep = EXCLUDED.rem_sleep,
      restfulness = EXCLUDED.restfulness,
      timing = EXCLUDED.timing,
      total_sleep = EXCLUDED.total_sleep,
      updated_at = CURRENT_TIMESTAMP
  `
}

export const upsertDailySleep = async (sleepData: DailySleep[]) => {
  if (sleepData.length === 0) return 0
  await Promise.all(sleepData.map(upsertSleepRecord))
  return sleepData.length
}

export const getLatestSleepDate = async (): Promise<string | null> => {
  const result = await sql`
    SELECT day FROM daily_sleep
    ORDER BY day DESC
    LIMIT 1
  `
  return result.length > 0 ? result[0].day : null
}

const createTablesSQL = `
CREATE TABLE IF NOT EXISTS daily_sleep (
  id TEXT PRIMARY KEY,
  day DATE NOT NULL,
  score INTEGER,
  timestamp TIMESTAMP NOT NULL,
  deep_sleep INTEGER,
  efficiency INTEGER,
  latency INTEGER,
  rem_sleep INTEGER,
  restfulness INTEGER,
  timing INTEGER,
  total_sleep INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_daily_sleep_day ON daily_sleep(day);
CREATE INDEX IF NOT EXISTS idx_daily_sleep_timestamp ON daily_sleep(timestamp);
`

export const initDb = async () => {
  await sql.unsafe(createTablesSQL)
}
