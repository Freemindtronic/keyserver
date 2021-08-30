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

  const { op, search } = Object.fromEntries(query.entries())

  const prisma = new PrismaClient()
  const keys = await prisma.publicKey.findMany()

  const body = `info:1:${keys.length}\n${keys
    .map((key) => {
      const {
        fingerprint,
        algo,
        length,
        createdAt,
        expiredAt,
        revoked,
        name,
        comment,
        email,
      } = key
      return `pub:${fingerprint}:${algo ?? ''}:${length ?? ''}:${Math.floor(
        createdAt.getTime() / 1000
      )}:${expiredAt ? Math.floor(expiredAt.getTime() / 1000) : ''}:${
        revoked ? 'r' : ''
      }\nuid:${escape(name)}${comment ? ` (${escape(comment)})` : ''}${
        email ? ` <${escape(email)}>` : ''
      }:::\n`
    })
    .join('')}`

  return { body }
}
