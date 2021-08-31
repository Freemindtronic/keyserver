import type { RequestHandler } from '@sveltejs/kit'
import { PrismaClient } from '@prisma/client'
import { armor, enums, PacketList, readKey } from 'openpgp'

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

  if (op !== 'index' && op !== 'get')
    return { status: 501, body: `Unsupported operation: ${op}` }

  const terms = search.split(',').filter(Boolean)

  const keys = await prisma.publicKey.findMany({
    include: { users: true },
    where:
      terms.length > 0
        ? {
            OR: terms.map((term) =>
              term.startsWith('0x')
                ? { fingerprint: term.slice(2) }
                : {
                    users: { some: { description: { contains: term.trim() } } },
                  }
            ),
          }
        : {},
  })

  if (op === 'index') {
    return {
      body: `info:1:${keys.length}\n${keys
        .map(
          ({
            fingerprint,
            algo,
            length,
            createdAt,
            expiredAt,
            revoked,
            users,
          }) => {
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
        .join('')}`,
    }
  } else {
    const packetList = new PacketList()
    for await (const key of keys.map(({ armoredKey }) =>
      readKey({ armoredKey })
    )) {
      packetList.push(...key.toPacketList())
    }
    return {
      body: armor(enums.armor.publicKey, packetList.write(), 0, 0),
    }
  }
}
