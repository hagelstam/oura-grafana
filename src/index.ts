import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL)

const rows = await sql`SELECT version()`

console.log(rows[0]?.['version'])
