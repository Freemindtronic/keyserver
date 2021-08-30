import type { RequestHandler } from '@sveltejs/kit'
import { PrismaClient } from '@prisma/client'

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

  const prisma = new PrismaClient()
  const keys = await prisma.key.findMany()

  return {
    body: `Operation: ${op}\nSearch terms: ${search}\nOptions: ${
      options.size > 0 ? [...options.values()].join(', ') : '*none*'
    }\n${JSON.stringify(keys)}`,
  }
}
