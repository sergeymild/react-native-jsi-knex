import { initialize as initializeKnex } from 'react-native-jsi-knex';
import type { Knex } from 'react-native-knex';

const createTables = async (knex: Knex) => {
  console.log('[InitDb.createTables]');
  await knex.schema.createTableIfNotExists('users', (table) => {
    table.increments('id').primary();
    table.string('name').unique();
  });
};

const createMigrationV1 = async (knex: Knex) => {
  console.log('[InitDb.createMigrationV1]');
  await knex.schema.createTableIfNotExists('searches', (table) => {
    table.increments('id').primary();
    table.string('query').unique();
  });
};

const createMigrationV5 = async (knex: Knex) => {
  console.log('[InitDb.createMigrationV3]');
  await knex.schema.createTableIfNotExists('articles', (table) => {
    table.increments('id').primary();
    table.string('title').unique();
  });
};

export const init = async (): Promise<Knex> => {
  console.log('[InitDb.init]');
  return await initializeKnex({
    version: 8,
    createTables,
    migrations: [
      { version: 3, migration: createMigrationV1 },
      { version: 7, migration: createMigrationV5 },
    ],
  });
};
