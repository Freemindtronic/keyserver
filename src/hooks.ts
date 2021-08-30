import type { Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ request, resolve }) => {
  if (!request.path.startsWith('/pks')) return resolve(request)

  if (request.path === '/pks/add') {
    if (request.method === 'GET')
      request.path = request.path.replace('/pks', '/ui')
    return resolve(request)
  }

  // Rewrite machine-readable paths to their human-readable equivalents
  const { query } = request
  const humanReadable = !query.get('options')?.split(',').includes('mr') ?? true
  if (humanReadable) request.path = request.path.replace('/pks', '/ui')
  return resolve(request)
}
