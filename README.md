# react-native-jsi-knex
Fork of [Knex](https://knexjs.org/) library optimized for mobile platforms.
Removed everything except SQLite support.
For Native connection it uses JSI library [react-native-quick-sqlite](https://github.com/ospfranco/react-native-quick-sqlite) under the hood
so there is no any performance issues due to React Native Bridge ans serialization/deserialization
## Installation

Add to `package.json`
```json
"react-native-jsi-knex": "sergeymild/react-native-jsi-knex",
"react-native-knex": "sergeymild/react-native-knex",
"react-native-quick-sqlite": "^4.0.5",
```

## Initialize

```js
import { Knex, initialize as initializeKnex } from 'react-native-jsi-knex';

export const initializeDatabase = async (): Promise<Knex> => {
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
  knexDatabase = await initializeDatabase()
  return knexDatabase
})
```

### Knex Query Builder

```ts
interface User {
  id: number;
  name: string;
  age: number;
}

await knex.table<User>('users') // User is the type of row in database
  .where('id', 1) // Your IDE will be able to help with the completion of id
  .first(); // Resolves to User | undefined

// Type of users is inferred as Pick<User, "id" | "age">[]
const users = await knex<User>('users')
  .select('id')
  .select('age')
```

### Most of api works identically as original Knex library for node.js.
### Full documentation may be found at https://knexjs.org/guide/query-builder.html

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
