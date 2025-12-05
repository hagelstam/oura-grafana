import { sql } from 'bun'
import type { PersonalInfo } from '@/types'

const PAT = process.env.OURA_PAT

const getPersonalInfo = async (): Promise<PersonalInfo> => {
  const response = await fetch('https://api.ouraring.com/v2/usercollection/personal_info', {
    headers: {
      Authorization: `Bearer ${PAT}`
    }
  })

  return (await response.json()) as PersonalInfo
}

const rows = await sql`SELECT version()`
console.log(rows)

const personalInfo = await getPersonalInfo()
console.log(personalInfo)
