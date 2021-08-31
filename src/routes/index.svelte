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
  <h2>Search tips</h2>
  <ul>
    <li>Leave the search field empty to list all public keys.</li>
    <li>
      Comma-separated terms are understood by the search engine: <kbd
        >john@example.com,john@example.org</kbd
      >.
    </li>
    <li>Terms starting with <kbd>0x</kbd> are matched against fingerprints.</li>
  </ul>
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
