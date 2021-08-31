<main>
  <slot />
  <footer>
    <p>
      You are on a semi-private <a
        href="https://en.wikipedia.org/wiki/Key_server_(cryptographic)"
        >key server</a
      >: keys can be browsed but not added.
    </p>
    <p><a href="/">Back to homepage</a></p>
  </footer>
</main>

<style lang="scss">
  main {
    max-width: 800px;
    margin: 1rem auto;
    padding: 0 1rem;
    overflow: hidden;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 0 1rem rgba(0, 0, 0, 0.1);
  }

  footer {
    color: #666;
    border-top: 1px solid #ccc;
    text-align: center;
    font-style: italic;
  }
</style>
