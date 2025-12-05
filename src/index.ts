import { neon } from '@neondatabase/serverless'
import type { PersonalInfo } from '@/types'

const PAT = process.env.OURA_PAT
const DB_URL = process.env.DATABASE_URL

const getPersonalInfo = async (): Promise<PersonalInfo> => {
  const response = await fetch('https://api.ouraring.com/v2/usercollection/personal_info', {
    headers: {
      Authorization: `Bearer ${PAT}`
    }
  })

  return (await response.json()) as PersonalInfo
}

const sql = neon(DB_URL)

const rows = await sql`SELECT version()`
console.log(rows[0]?.['version'])

const personalInfo = await getPersonalInfo()
console.log(personalInfo)
