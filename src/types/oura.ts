export interface Sleep {
  id: string
  day: string
  bedtime_start: string
  bedtime_end: string
  total_sleep_duration: number | null
  time_in_bed: number
  awake_time: number | null
  light_sleep_duration: number | null
  rem_sleep_duration: number | null
  deep_sleep_duration: number | null
  latency: number | null
  efficiency: number | null
  average_heart_rate: number
  lowest_heart_rate: number
  average_hrv: number | null
  average_breath: number | null
  type: string
  readiness: {
    score: number
  } | null
}

export interface SleepResponse {
  data: Sleep[]
  next_token: string | null
}
