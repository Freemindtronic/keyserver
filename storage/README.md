# Keyserver storage

This directory contains the keyserver's storage:

- **keys.db**: a SQLite database containing all the public keys
- **main-keys/\*.pub**: new keys have to be signed by at least one of the keys stored in this directory to be accepted

**Note:** nothing in this directory is sensitive.
