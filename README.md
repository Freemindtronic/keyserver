# keyserver

Custom Nodes.js implementation of the [OpenPGP HTTP Keyserver Protocol (HKP)](https://datatracker.ietf.org/doc/html/draft-shaw-openpgp-hkp-00), with a few modifications:

- HTTP 1.1 is used instead of HTTP 1.0
- Search by fingerprint must contain the whole fingerprint
- The `index` and `vindex` operations are the same
- The `nm` (No Modification) and `exact` options are ignored
- The `fingerprint` option is always on
- Keys submitted are accepted only if all UIDs are signed by at least one _main key_ (place main keys in storage/main-keys)

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
