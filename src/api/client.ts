import type { DailySleepResponse } from '@/types'

const BASE_URL = 'https://api.ouraring.com/v2'

const buildUrl = (startDate?: string, endDate?: string, nextToken?: string) => {
  const params = new URLSearchParams()

  if (startDate) params.append('start_date', startDate)
  if (endDate) params.append('end_date', endDate)
  if (nextToken) params.append('next_token', nextToken)

  const query = params.toString()
  return `${BASE_URL}/usercollection/daily_sleep${query ? `?${query}` : ''}`
}

const fetchSleep = async (
  accessToken: string,
  startDate?: string,
  endDate?: string,
  nextToken?: string
) => {
  const res = await fetch(buildUrl(startDate, endDate, nextToken), {
    headers: { Authorization: `Bearer ${accessToken}` }
  })
  if (!res.ok) {
    throw new Error(`Oura API request failed: ${res.status} ${res.statusText}`)
  }

  return res.json() as Promise<DailySleepResponse>
}

export const getAllDailySleep = async (
  accessToken: string,
  startDate?: string,
  endDate?: string
): Promise<DailySleepResponse['data']> => {
  const fetchPages = async (
    token: string | null = null,
    acc: DailySleepResponse['data'] = []
  ): Promise<DailySleepResponse['data']> => {
    const res = await fetchSleep(accessToken, startDate, endDate, token ?? undefined)
    const data = [...acc, ...res.data]
    return res.next_token ? fetchPages(res.next_token, data) : data
  }

  return fetchPages()
}
