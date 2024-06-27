## Description

Test service implementing one time links

Requirements:
* create one time link - accept string, generate, save in db, click on link returns string
* one time link must be unique, cannot have two equal active one time links
* get value by one time link - when getting check if it is active, return error if it is already used
* should follow SOLID
* code should be deployed on github
* any way of storing data can be used

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## License

[MIT licensed](LICENSE).
