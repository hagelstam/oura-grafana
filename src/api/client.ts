import type { SleepResponse } from '@/types'

const BASE_URL = 'https://api.ouraring.com/v2'

const buildUrl = (startDate?: string, endDate?: string, nextToken?: string) => {
  const params = new URLSearchParams()

  if (startDate) params.append('start_date', startDate)
  if (endDate) params.append('end_date', endDate)
  if (nextToken) params.append('next_token', nextToken)

  const query = params.toString()
  return `${BASE_URL}/usercollection/sleep${query ? `?${query}` : ''}`
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
    const text = await res.text()
    throw new Error(`Oura API request failed: ${res.status} ${text}`)
  }

  return res.json() as Promise<SleepResponse>
}

export const getAllSleep = async (
  accessToken: string,
  startDate?: string,
  endDate?: string
): Promise<SleepResponse['data']> => {
  const fetchPages = async (
    token: string | null = null,
    acc: SleepResponse['data'] = []
  ): Promise<SleepResponse['data']> => {
    const res = await fetchSleep(accessToken, startDate, endDate, token ?? undefined)
    const data = [...acc, ...res.data]
    return res.next_token ? fetchPages(res.next_token, data) : data
  }

  return fetchPages()
}
