import * as api from '@/api/client'
import * as db from '@/db/client'
import type { Sleep } from '@/types'

const EARLIEST_DATE = '2025-06-01'

const toISODate = (date: Date) => date.toISOString().split('T')[0] ?? ''

const addDays = (date: Date, days: number) => {
  const newDate = new Date(date)
  newDate.setDate(newDate.getDate() + days)
  return newDate
}

const toUTCISOString = (timestamp: string) => {
  const date = new Date(timestamp)
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid timestamp: ${timestamp}`)
  }
  return date.toISOString()
}

const convertSleepToUTC = (sleep: Sleep) => {
  return {
    ...sleep,
    bedtime_start: toUTCISOString(sleep.bedtime_start),
    bedtime_end: toUTCISOString(sleep.bedtime_end)
  }
}

export const syncSleepData = async (accessToken: string) => {
  const latestDate = await db.getLatestSleepDate()
  const endDate = toISODate(new Date())

  const startDate = latestDate ? toISODate(addDays(new Date(latestDate), 1)) : EARLIEST_DATE

  if (new Date(startDate) > new Date(endDate)) {
    console.log('Already up to date')
    return
  }

  if (latestDate) {
    console.log(`Syncing from last recorded date: ${startDate}`)
  } else {
    console.log('No existing data. Syncing all historical data')
  }

  console.log(`Fetching sleep data from ${startDate} to ${endDate}...`)
  const sleepData = await api.getAllSleep(accessToken, startDate, endDate)

  console.log(`Fetched ${sleepData.length} sleep records`)

  if (sleepData.length === 0) {
    console.log('No new sleep data to sync')
    return
  }

  const sleepDataUTC = sleepData.map(convertSleepToUTC)

  const upsertedCount = await db.upsertSleep(sleepDataUTC)
  console.log(`Successfully synced ${upsertedCount} sleep records`)
}
