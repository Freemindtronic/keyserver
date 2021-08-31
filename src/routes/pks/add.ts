/**
 * @see https://datatracker.ietf.org/doc/html/draft-shaw-openpgp-hkp-00
 * @module
 */

import type { RequestHandler } from '@sveltejs/kit'
import { prisma } from '$lib/prisma'
import { readKey } from 'openpgp'

enum algoId {
  rsaEncryptSign = 1,
  rsaEncrypt = 2,
  rsaSign = 3,
  elgamal = 16,
  dsa = 17,
  ecdh = 18,
  ecdsa = 19,
  eddsa = 22,
  aedh = 23,
  aedsa = 24,
}

/** Answers to POST request. */
export const post: RequestHandler = async ({ body }) => {
  if (!body || typeof body !== 'object' || !('get' in body)) {
    return {
      status: 400,
      body: 'Send data with Content-type: application/x-www-form-urlencoded',
    }
  }
  try {
    // Get the key from the request body
    const armoredKey = body.get('keytext')
    if (!armoredKey) return { status: 400, body: 'Missing keytext.' }

    // Read the key
    const key = await readKey({ armoredKey })
    const fingerprint = key.getFingerprint().toLowerCase()

    // Ensure the key is public
    if (key.isPrivate()) {
      return {
        status: 400,
        body: 'Please provide a public key, and keep this private key safe.',
      }
    }

    const { userID, selfCertifications } = (await key.getPrimaryUser()).user

    if (!userID || selfCertifications.length === 0)
      return { status: 400, body: 'The key does not contain a primary user.' }

    const { algorithm, bits } = key.getAlgorithmInfo()
    const expirationTime = await key.getExpirationTime()

    // Produce the data to store in the database
    const publicKey = {
      fingerprint,
      algo: algoId[algorithm],
      length: bits,
      createdAt: key.getCreationTime(),
      expiredAt: expirationTime instanceof Date ? expirationTime : undefined,
      revoked:
        selfCertifications && (await key.isRevoked(selfCertifications[0])),
      armoredKey,
      users: {
        create: key.users
          .map(({ userID }) => userID?.userID)
          .filter((x): x is string => Boolean(x))
          .map((description) => ({ description })),
      },
    }

    // Either update or create the key
    await prisma.publicKey.upsert({
      create: publicKey,
      update: publicKey,
      where: { fingerprint },
    })

    return { status: 200, body: 'Key added successfully' }
  } catch (error: unknown) {
    return {
      status: 400,
      body: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
