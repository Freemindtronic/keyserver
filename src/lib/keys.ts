import fs from 'fs'
import glob from 'fast-glob'
import { Key, readKey } from 'openpgp'

export const getKeys = async (): Promise<Key[]> =>
  await Promise.all(
    (await glob('main-keys/*.pub')).map(async (file) => {
      const armoredKey = await fs.promises.readFile(file, 'utf8')
      return readKey({ armoredKey })
    })
  )
