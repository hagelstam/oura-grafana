export interface SleepContributors {
  deep_sleep: number | null
  efficiency: number | null
  latency: number | null
  rem_sleep: number | null
  restfulness: number | null
  timing: number | null
  total_sleep: number | null
}

export interface DailySleep {
  id: string
  contributors: SleepContributors
  day: string
  score: number | null
  timestamp: string
}

export interface DailySleepResponse {
  data: DailySleep[]
  next_token: string | null
}
