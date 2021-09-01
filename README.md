# keyserver

Nodes.js implementation of the [OpenPGP HTTP Keyserver Protocol (HKP)](https://datatracker.ietf.org/doc/html/draft-shaw-openpgp-hkp-00).

## Contributing

If the machine does not have Node or Yarn installed, install [Volta](https://volta.sh/) first, and it will install Node and Yarn for you.

```bash
# Install dependencies
yarn install --immutable

# Create an empty database
yarn prisma db push

# Start the dev server
yarn dev
```

## Usage in production

```bash
# Install dependencies, create a database if it does not exist, and start the server
docker-compose up
```

Please note that data is shared between the dev and production servers through the [storage directory.](./storage/README.md)
