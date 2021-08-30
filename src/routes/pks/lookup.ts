import type { RequestHandler } from '@sveltejs/kit'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const get: RequestHandler = async ({ query }) => {
  if (!query.has('op') || !query.has('search')) {
    return {
      status: 400,
      body: `Missing parameters (${['op', 'search']
        .filter((param) => !query.has(param))
        .join(', ')})`,
    }
  }

  const { op, search } = Object.fromEntries(query.entries())

  const terms = search.split(',').filter(Boolean)

  const keys = await prisma.publicKey.findMany({
    include: { users: true },
    where:
      terms.length > 0
        ? {
            OR: terms.map((term) => ({
              users: { some: { description: { contains: term } } },
            })),
          }
        : {},
  })

  const body = `info:1:${keys.length}\n${keys
    .map(
      ({ fingerprint, algo, length, createdAt, expiredAt, revoked, users }) => {
        return (
          `pub:${fingerprint}:${algo ?? ''}:${length ?? ''}:${Math.floor(
            createdAt.getTime() / 1000
          )}:${expiredAt ? Math.floor(expiredAt.getTime() / 1000) : ''}:${
            revoked ? 'r' : ''
          }${expiredAt && expiredAt < new Date() ? 'e' : ''}\n` +
          users
            .map(
              ({ description }) =>
                `uid:${description.replace(/:/g, '%3A')}:::\n`
            )
            .join('')
        )
      }
    )
    .join('')}`

  return { body }
}
