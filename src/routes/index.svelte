<main>
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
        <input type="checkbox" name="options" value="mr" id="options" /> Machine
        readable output
      </label>
    </p>
  </form>
  <footer>
    <p>
      You are on a semi-private <a
        href="https://en.wikipedia.org/wiki/Key_server_(cryptographic)"
        >key server</a
      >: keys can be browsed but not added. Leave the search field empty to list
      all public keys.
    </p>
  </footer>
</main>

<style lang="scss">
  main {
    max-width: 600px;
    margin: 1rem auto;
    padding: 0 1rem;
    overflow: hidden;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 0 1rem rgba(0, 0, 0, 0.1);
  }

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

  footer {
    border-top: 1px solid #ccc;
    color: #666;
    font-style: italic;
  }
</style>
