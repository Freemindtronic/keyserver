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

  const algoId: Record<number, string> = {
    1: 'RSA (ES)',
    2: 'RSA (E)',
    3: 'RSA (S)',
    16: 'ElGamal',
    17: 'DSA',
    18: 'ECDH',
    19: 'ECDSA',
    22: 'EdDSA',
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
          createdAt: new Date(Number(parts[4]) * 1000),
          expiredAt: parts[5] === '' ? null : new Date(Number(parts[5]) * 1000),
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

<h1>Search results</h1>
{#each keys as key (key.id)}
  <section>
    <h2>
      <a href="?op=index&search={key.users[0].description}"
        >{key.users[0].description}</a
      >
    </h2>
    {#if key.users.length > 1}
      <p class="users"><strong class="label">Other users:</strong></p>
      <ul class="user-list">
        {#each key.users.slice(1) as user (user.id)}
          <li>{user.description}</li>
        {/each}
      </ul>
    {/if}
    <p>
      <strong class="label">Fingerprint:</strong>
      <a href="?op=get&search=0x{key.fingerprint}">
        {key.fingerprint.toUpperCase()}
      </a>
      {#if key.revoked}<strong class="revoked">(REVOKED)</strong>{/if}
    </p>
    <div class="details">
      <p>
        <strong class="label">Algorithm:</strong>
        {key.algo ? algoId[key.algo] : 'Unknown'}
        {key.length ? `${key.length} bits` : ''}
      </p>
      <p>
        <strong class="label">Created: </strong>
        {key.createdAt.toLocaleDateString()}
      </p>
      <p>
        <strong class="label">Expires: </strong>
        {key.expiredAt === null ? 'Never' : key.expiredAt.toLocaleDateString()}
      </p>
    </div>
  </section>
{:else}
  <p>No results found.</p>
{/each}

<style lang="scss">
  section {
    margin-block-end: 2em;
    border-radius: 4px;
    box-shadow: 0 0 4px #bbb;
    padding: 1em;

    > h2 {
      margin: 0 0 1rem;
    }
  }

  a {
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  .users {
    margin: 0;
  }

  .user-list {
    margin: 0 0 0.5rem;
  }

  .details {
    display: flex;
    gap: 1rem;

    > p {
      flex: 1;
      margin: 0;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 0.5rem;
      background-color: #fff;
    }
  }

  .label {
    display: block;
    color: #333;
    text-transform: uppercase;
    font-size: 0.75em;
    font-weight: bold;
  }

  .revoked {
    color: #800;
  }
</style>
