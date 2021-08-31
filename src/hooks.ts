import type { Handle } from '@sveltejs/kit'

export const handle: Handle = ({ request, resolve }) => {
  const { query, method, path } = request
  if (!path.startsWith('/pks') || method !== 'GET') return resolve(request)

  // Rewrite machine-readable paths to their human-readable equivalents
  if (
    path.startsWith('/pks/lookup') &&
    !query.get('options')?.split(',').includes('mr')
  ) {
    const op = query.get('op')
    request.path = `/ui/lookup${op === 'index' ? '' : `/${op}`}`
  } else if (path.startsWith('/pks/add')) {
    request.path = path.replace('/pks', '/ui')
  }

  return resolve(request)
}
