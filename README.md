# react-native-jsi-knex
React Native knex based on jsi quickSqlite
## Installation

Add to `package.json`
```json
"react-native-jsi-knex": "sergeymild/react-native-jsi-knex",
"react-native-knex": "sergeymild/react-native-knex",
"react-native-quick-sqlite": "^4.0.5",
```

## Initialize

```js


export const initializeKnex = async (): Promise<Knex> => {
  return await initializeKnex({
    name: 'mydb.sqlite',
    debug: true,
    version: 1, // set version 1 as initial version (set 2 to run migrations for version: 2)
    createTables,
    // migrations will be run on increment knex version
    migrations: [{version: 2, migration: createMigrationV1}],
  });
};

const createTables = async (knex: Knex) => {
  await knex.schema.createTableIfNotExists('users', (table) => {
    table.increments('id').primary();
    table.string('name').unique();
  });
};

const createMigrationV1 = async (knex: Knex) => {
  await knex.schema.createTableIfNotExists('searches', (table) => {
    table.increments('id').primary();
    table.string('query').unique();
  });
};
```

### Lazy initialization
```ts
type Callback = () => Promise<Knex>
function memoize(callback: Callback) {
  let result: Knex
  return async () => {
    if (result === undefined) result = await callback()
    return result
  }
}

let didRun = false
export let knexDatabase!: Knex
export const database = memoize(async () => {
  if (didRun || knexDatabase) return knexDatabase!
  knexDatabase = await initializeKnex()
  return knexDatabase
})
```

### Example of usage

```ts
interface Search {
  readonly id: number
  readonly query: string
}

const response = await database
  .table<Search>('searches')
  .where({id: 2, query: 'string'})
  .first()
console.log(response.id, response.query)
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
