<script context="module" lang="ts">
  import type { Load } from '@sveltejs/kit'
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
  import type { PublicKey, User } from '@prisma/client'

  export let data: string

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

  let keys: Array<PublicKey & { users: User[] }> = []

  $: {
    // Local unique identifiers for table rows
    let keyId = 1
    let userId = 1

    const lines = data.split('\n')
    lines.shift()
    let key: (PublicKey & { users: User[] }) | undefined
    for (const line of lines) {
      const parts = line.split(':')
      if (parts[0] === 'pub') {
        key = {
          id: keyId++,
          fingerprint: parts[1],
          algo: Number(parts[2]),
          length: Number(parts[3]),
          createdAt: new Date(parts[4]),
          expiredAt: parts[5] === '' ? null : new Date(parts[5]),
          revoked: parts[6].includes('r'),
          users: [],
          armoredKey: '',
        }
        keys.push(key)
      } else if (parts[0] === 'uid' && key) {
        key.users.push({
          id: userId++,
          keyId: key.id,
          description: decodeURIComponent(parts[1]),
        })
      }
    }
  }
</script>

{#each keys as key (key.id)}
  <h2>{key.fingerprint}</h2>
  <p>
    {key.algo ? algoId[key.algo] : 'unknown'}
    {key.length} / Created at {key.createdAt} / Expires at {key.expiredAt ===
    null
      ? 'never'
      : key.expiredAt}
  </p>
  <ul>
    {#each key.users as user (user.id)}
      <li>{user.description}</li>
    {/each}
  </ul>
{/each}

<style>
  p {
    padding: 0 1em;
    white-space: pre-line;
  }
</style>
