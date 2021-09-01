# keyserver

Nodes.js implementation of the OpenPGP HTTP Keyserver Protocol (HKP)

## How to use

If the machine does not have Node or Yarn installed, install [Volta](https://volta.sh/) first, and it will install Node and Yarn for you.

```
# Install dependencies
yarn install --immutable

# Create an empty database
yarn prisma migrate reset

# Start the dev server
yarn dev

# Or start the production server
docker-compose up
```

Please note that data is shared between the dev and production servers through the [storage directory.](./storage/README.md)
