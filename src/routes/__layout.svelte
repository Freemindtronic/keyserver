<main>
  <slot />
  <footer>
    <p>
      You are on a semi-private
      <a href="https://github.com/Freemindtronic/keyserver">key server</a>: keys
      can be browsed but not added.
    </p>
    <p><a href="/">Back to homepage</a></p>
  </footer>
</main>

<style lang="scss">
  :global {
    *,
    ::before,
    ::after {
      box-sizing: inherit;
    }
    :root {
      box-sizing: border-box;
    }
    body {
      // Source: https://unpkg.com/sanitize.css@12.0.1/typography.css
      font-family: system-ui, -apple-system, 'Segoe UI', 'Roboto', 'Ubuntu',
        'Cantarell', 'Noto Sans', sans-serif;
      background-color: #eee;
      margin: 0;
    }
    h1 {
      text-align: center;
    }
  }

  main {
    max-width: 800px;
    margin: 1rem auto;
    padding: 0 1rem;
    overflow: hidden;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 0 1rem rgba(0, 0, 0, 0.2);
  }

  footer {
    color: #666;
    border-top: 1px solid #ccc;
    text-align: center;
    font-style: italic;
  }
</style>
