/**
 * @see https://datatracker.ietf.org/doc/html/draft-shaw-openpgp-hkp-00
 * @module
 */

import type { RequestHandler } from '@sveltejs/kit'
import { prisma } from '$lib/prisma'
import { armor, enums, PacketList, readKey } from 'openpgp'
import debug from 'debug'

const log = debug('keyserver:lookup')

/** Answers to GET requests. */
export const get: RequestHandler = async ({ query }) => {
  // Ignore requests missing required parameters
  if (!query.has('op') || !query.has('search')) {
    return {
      status: 400,
      body: `Missing parameters (${['op', 'search']
        .filter((param) => !query.has(param))
        .join(', ')})`,
    }
  }

  const { op, search } = Object.fromEntries(query.entries())

  // Ignore `vindex` and unknown operations
  if (op !== 'index' && op !== 'vindex' && op !== 'get')
    return { status: 501, body: `Unsupported operation: ${op}` }

  // Split comma-separated search terms, and remove trailing whitespace
  const terms = search
    .split(',')
    .filter(Boolean)
    .map((term) => term.trim())

  // Get all keys matching comma-separated search terms
  const keys = await prisma.publicKey.findMany({
    include: { users: true },
    where:
      terms.length > 0
        ? {
            // Terms are ORed together
            OR: terms.map((term) =>
              term.startsWith('0x')
                ? { fingerprint: term.slice(2).toLowerCase() }
                : {
                    users: { some: { description: { contains: term } } },
                  }
            ),
          }
        : {},
    // Limit to 1000 results, just in case
    take: 1000,
  })

  log('Received a `%s` operation that yielded %s results', op, keys.length)

  // If the operation is `index`, return a machine-readable list of keys
  if (op === 'index' || op === 'vindex') {
    // info:<version>:<count>
    let body = `info:1:${keys.length}\n`

    for (const {
      fingerprint,
      algo,
      length,
      createdAt,
      expiredAt,
      revoked,
      users,
    } of keys) {
      // pub:<keyid>:<algo>:<keylen>:<creationdate>:<expirationdate>:<flags>
      body += `pub:${fingerprint}:${algo ?? ''}:${length ?? ''}:${Math.floor(
        createdAt.getTime() / 1000
      )}:${expiredAt ? Math.floor(expiredAt.getTime() / 1000) : ''}:${
        revoked ? 'r' : ''
      }${expiredAt && expiredAt < new Date() ? 'e' : ''}\n`

      for (const { description } of users) {
        // uid:<escaped uid string>:<creationdate>:<expirationdate>:<flags>
        body += `uid:${description.replace(/:/g, '%3A')}:::\n`
      }
    }

    return { body }
  }

  // If the operation is `get`, return all matching keys as a PGP packet
  else {
    if (keys.length === 0) return { status: 404, body: 'No keys found' }
    // If there is only one key, return the armored key as is
    else if (keys.length === 1) return { body: keys[0].armoredKey }

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
