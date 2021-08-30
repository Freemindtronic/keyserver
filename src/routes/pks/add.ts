import type { RequestHandler } from '@sveltejs/kit'
import { PrismaClient } from '@prisma/client'
import { readKey } from 'openpgp'

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
  const { userID } = (await key.getPrimaryUser()).user

  if (!userID)
    return { status: 400, body: 'The key does not contain a primary user' }

  const prisma = new PrismaClient()

  console.log(
    await prisma.key.create({
      data: {
        key: armoredKey,
        name: userID.name,
        email: userID.email,
        comment: userID.comment,
        fingerprint: key.getFingerprint(),
      },
    })
  )
}
