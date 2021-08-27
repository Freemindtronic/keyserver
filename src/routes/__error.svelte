<script context="module" lang="ts">
  import type { ErrorLoad } from '@sveltejs/kit'

  export const load: ErrorLoad = ({ status }) => {
    return {
      props: {
        status,
      },
    }
  }
</script>

<script lang="ts">
  export let status: number
</script>

<main>
  {#if status === 404}
    <h1>{status} Not found</h1>
  {:else if status === 501}
    <h1>{status} Not implemented</h1>
  {:else}
    <h1>500 Internal server error</h1>
  {/if}
  <a href="/">Homepage</a>
</main>

<style lang="scss">
  main {
    text-align: center;
  }
</style>
