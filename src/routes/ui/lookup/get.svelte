<script context="module" lang="ts">
  import type { Load } from '@sveltejs/kit'

  export const hydrate = false

  export const load: Load = async ({ page: { query }, fetch }) => {
    query.set(
      'options',
      query.has('options') ? query.get('options') + ',mr' : 'mr'
    )
    const response = await fetch(`/pks/lookup?${query}`)

    return {
      props: {
        data: await response.text(),
      },
    }
  }
</script>

<script lang="ts">
  export let data: string
</script>

<svelte:head>
  <title>Public key</title>
</svelte:head>

<h1>Public key results</h1>
<pre>{data}</pre>
