import * as db from '@/db/client'
import * as sync from '@/services/sync'

try {
  console.log('Initializing database...')
  await db.initDb()
  await sync.syncSleepData(process.env.OURA_PAT)
} catch (error) {
  console.error('Error during sync:', error)
  process.exit(1)
}
