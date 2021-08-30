import type { Handle } from '@sveltejs/kit'

export const handle: Handle = ({ request, resolve }) => {
  const { query, method, path } = request
  if (!path.startsWith('/pks')) return resolve(request)

  const humanReadable =
    method === 'GET' && !query.get('options')?.split(',').includes('mr')

  // Rewrite machine-readable paths to their human-readable equivalents
  if (humanReadable) request.path = path.replace('/pks', '/ui')
  return resolve(request)
}
