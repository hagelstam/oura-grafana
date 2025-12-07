import * as api from '@/api/client'
import * as db from '@/db/client'

const EARLIEST_DATE = '2025-06-01'

const toISODate = (date: Date) => date.toISOString().split('T')[0] ?? ''

const addDays = (date: Date, days: number) => {
  const newDate = new Date(date)
  newDate.setDate(newDate.getDate() + days)
  return newDate
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
  const sleepData = await api.getAllDailySleep(accessToken, startDate, endDate)

  console.log(`Fetched ${sleepData.length} sleep records`)

  if (sleepData.length === 0) {
    console.log('No new sleep data to sync')
    return
  }

  const upsertedCount = await db.upsertDailySleep(sleepData)
  console.log(`Successfully synced ${upsertedCount} sleep records`)
}
