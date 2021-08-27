import type { EndpointOutput } from '@sveltejs/kit'

export const get = async (): Promise<EndpointOutput> => {
  return { body: 'Hello World!' }
}
