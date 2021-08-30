import type { RequestHandler } from '@sveltejs/kit'
import { PrismaClient } from '@prisma/client'
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

export const post: RequestHandler = async ({ body }) => {
  if (!body || typeof body !== 'object' || !('get' in body)) {
    return {
      status: 400,
      body: 'Send data with Content-type: application/x-www-form-urlencoded',
    }
  }

  // Get the key from the request body
  const armoredKey = body.get('keytext')
  if (!armoredKey) return { status: 400, body: 'Missing keytext' }

  // Read the key
  const key = await readKey({ armoredKey })
  const { userID, selfCertifications } = (await key.getPrimaryUser()).user

  if (!userID)
    return { status: 400, body: 'The key does not contain a primary user' }

  const { algorithm, bits } = key.getAlgorithmInfo()
  const expirationTime = await key.getExpirationTime()

  const prisma = new PrismaClient()

  await prisma.publicKey.create({
    data: {
      fingerprint: key.getFingerprint().toUpperCase(),
      algo: algoId[algorithm],
      length: bits,
      createdAt: key.getCreationTime(),
      expiredAt: expirationTime instanceof Date ? expirationTime : undefined,
      revoked:
        selfCertifications && (await key.isRevoked(selfCertifications[0])),
      name: userID.name,
      email: userID.email,
      comment: userID.comment,
      armoredKey,
    },
  })
}
