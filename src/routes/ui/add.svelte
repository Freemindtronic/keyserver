<script lang="ts">
  let keytext = ''
  let success = true
  let result: string | undefined

  const send = async () => {
    const response = await fetch('/pks/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ keytext }),
    })

    success = response.status < 400
    result = await response.text()
  }
</script>

<h1>Add (or update) a key</h1>
<form on:submit|preventDefault={send}>
  <p>
    <label for="keytext">Armored (base64) key:</label>
  </p>
  <p>
    <textarea
      id="keytext"
      placeholder="-----BEGIN PGP PUBLIC KEY BLOCK-----

..."
      rows="12"
      bind:value={keytext}
    />
  </p>
  <p>
    <button type="submit">Add</button>
  </p>
  {#if result}
    <p class:success class:error={!success}>{result}</p>
  {/if}
</form>

<style lang="scss">
  textarea {
    box-sizing: border-box;
    width: 100%;
    resize: vertical;
  }

  button {
    padding: 0.5rem;
    border-radius: 4px;
    border: 1px solid #888;
  }

  .success {
    padding: 1em;
    border: 1px solid #080;
    background-color: #cfc;
  }

  .error {
    padding: 1em;
    border: 1px solid #800;
    background-color: #fcc;
  }
</style>
