import type { RequestHandler } from '@sveltejs/kit'

export const get: RequestHandler = async ({ query }) => {
  if (!query.has('op') || !query.has('search')) {
    return {
      status: 400,
      body: `Missing parameters (${['op', 'search']
        .filter((param) => !query.has(param))
        .join(', ')})`,
    }
  }

  const { op, search, options: optionsString = '' } = Object.fromEntries(
    query.entries()
  )
  const options = new Set(optionsString.split(',').filter(Boolean))

  return {
    body: `Operation: ${op}\nSearch terms: ${search}\nOptions: ${
      options.size > 0 ? [...options.values()].join(', ') : '*none*'
    }`,
  }
}
