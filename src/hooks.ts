import type { Handle } from '@sveltejs/kit'

export const handle: Handle = ({ request, resolve }) => {
  const { query, method, path } = request
  if (!path.startsWith('/pks')) return resolve(request)

  const humanReadable =
    path === '/pks/add'
      ? // The user sends a GET request to the /pks/add endpoint...
        method === 'GET'
      : // ...or the "mr" option is not explicitly given
        !query.get('options')?.split(',').includes('mr')

  // Rewrite machine-readable paths to their human-readable equivalents
  if (humanReadable) request.path = path.replace('/pks', '/ui')
  return resolve(request)
}
