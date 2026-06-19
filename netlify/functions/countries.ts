import type { Config } from '@netlify/functions'

export default async (): Promise<Response> => {
  try {
    const response = await fetch('https://www.apicountries.com/countries', {
      headers: {
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      return new Response(response.statusText, { status: response.status })
    }

    const data = await response.json()

    return Response.json(data, {
      headers: {
        'Netlify-CDN-Cache-Control': 'public, durable, max-age=86400, stale-while-revalidate=300',
        'Cache-Control': 'public, max-age=0, must-revalidate',
      },
    })
  } catch (error) {
    console.error('Countries proxy failed:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}

export const config: Config = {
  path: '/api/countries',
}
