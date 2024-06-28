## Description

Test service implementing one time links

Requirements:
* create one time link - accept string, generate, save in db, click on link returns string
* one time link must be unique, cannot have two equal active one time links
* get value by one time link - when getting check if it is active, return error if it is already used
* should follow SOLID
* code should be deployed on github
* any way of storing data can be used

Notes:
* mongodb - just most convenient to work with for me, also mongo follows ACID
* we not store full URL, backend wise only token relevant, also storing full URL make data migration to different URL harder
* added unique index on token
* added unique partial index for content when is\_actvie: true
* mongodb errors will be thrown as Internal Server Error, might want to add error filter to return corresponding handled http errors
* if user create link but later forget the token, he cannot create new one unless current one used
* renamed e2e to integration because e2e are tests where interactions happens in browser
* added gh actions for lint and test checks
* added dockerfile to be release ready to k8s

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
$ pnpm t

# integration tests
# don't forget to run docker-compose
$ pnpm run test:integratino
```

## License

[MIT licensed](LICENSE).
