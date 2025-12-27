import { sql } from 'bun'
import type { Sleep } from '@/types'

const upsertSleepRecord = async (sleep: Sleep) => {
  await sql`
    INSERT INTO sleep (
      id, day, bedtime_start, bedtime_end,
      total_sleep_duration, time_in_bed, awake_time,
      light_sleep_duration, rem_sleep_duration, deep_sleep_duration,
      latency, efficiency,
      average_heart_rate, lowest_heart_rate, average_hrv, average_breath,
      readiness_score, type, updated_at
    ) VALUES (
      ${sleep.id},
      ${sleep.day},
      ${sleep.bedtime_start},
      ${sleep.bedtime_end},
      ${sleep.total_sleep_duration},
      ${sleep.time_in_bed},
      ${sleep.awake_time},
      ${sleep.light_sleep_duration},
      ${sleep.rem_sleep_duration},
      ${sleep.deep_sleep_duration},
      ${sleep.latency},
      ${sleep.efficiency},
      ${sleep.average_heart_rate},
      ${sleep.lowest_heart_rate},
      ${sleep.average_hrv},
      ${sleep.average_breath},
      ${sleep.readiness?.score ?? null},
      ${sleep.type},
      CURRENT_TIMESTAMP
    )
    ON CONFLICT (id) DO UPDATE SET
      day = EXCLUDED.day,
      bedtime_start = EXCLUDED.bedtime_start,
      bedtime_end = EXCLUDED.bedtime_end,
      total_sleep_duration = EXCLUDED.total_sleep_duration,
      time_in_bed = EXCLUDED.time_in_bed,
      awake_time = EXCLUDED.awake_time,
      light_sleep_duration = EXCLUDED.light_sleep_duration,
      rem_sleep_duration = EXCLUDED.rem_sleep_duration,
      deep_sleep_duration = EXCLUDED.deep_sleep_duration,
      latency = EXCLUDED.latency,
      efficiency = EXCLUDED.efficiency,
      average_heart_rate = EXCLUDED.average_heart_rate,
      lowest_heart_rate = EXCLUDED.lowest_heart_rate,
      average_hrv = EXCLUDED.average_hrv,
      average_breath = EXCLUDED.average_breath,
      readiness_score = EXCLUDED.readiness_score,
      type = EXCLUDED.type,
      updated_at = CURRENT_TIMESTAMP
  `
}

export const upsertSleep = async (sleepData: Sleep[]) => {
  if (sleepData.length === 0) return 0

  for (const sleep of sleepData) {
    await upsertSleepRecord(sleep)
  }

  return sleepData.length
}

export const getLatestSleepDate = async (): Promise<string | null> => {
  try {
    const result = await sql`
      SELECT day FROM sleep
      ORDER BY day DESC
      LIMIT 1
    `
    return result.length > 0 ? result[0].day : null
    // eslint-disable-next-line no-unused-vars
  } catch (err) {
    console.log('No sleep table exists yet, starting fresh')
    return null
  }
}

const createTablesSQL = `
DROP TABLE IF EXISTS daily_sleep;

CREATE TABLE IF NOT EXISTS sleep (
  id TEXT PRIMARY KEY,
  day DATE NOT NULL,
  bedtime_start TIMESTAMP NOT NULL,
  bedtime_end TIMESTAMP NOT NULL,
  total_sleep_duration INTEGER,
  time_in_bed INTEGER NOT NULL,
  awake_time INTEGER,
  light_sleep_duration INTEGER,
  rem_sleep_duration INTEGER,
  deep_sleep_duration INTEGER,
  latency INTEGER,
  efficiency INTEGER,
  average_heart_rate NUMERIC,
  lowest_heart_rate INTEGER,
  average_hrv INTEGER,
  average_breath NUMERIC,
  readiness_score INTEGER,
  type TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sleep_day ON sleep(day);
CREATE INDEX IF NOT EXISTS idx_sleep_bedtime_start ON sleep(bedtime_start);
`

export const initDb = async () => {
  await sql.unsafe(createTablesSQL)
}
