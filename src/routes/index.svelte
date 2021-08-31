<h1>Keyserver</h1>
<form action="/pks/lookup">
  <input type="hidden" name="op" value="index" />
  <p>
    <label for="search">Search:</label>
    <input type="search" id="search" name="search" />
    <button type="submit">🔍</button>
  </p>
  <p>
    <label for="options">
      <input type="checkbox" name="options" value="mr" id="options" /> Machine readable
      output
    </label>
  </p>
  <p>Leave the search field empty to list all public keys.</p>
</form>

<style lang="scss">
  form > p {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    > input {
      flex: 1;
    }
  }

  input,
  button {
    padding: 0.5rem;
    border-radius: 4px;
    border: 1px solid #888;
  }
</style>
