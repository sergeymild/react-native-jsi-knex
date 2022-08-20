import { Knex, NativeClient } from 'react-native-knex';
import { KnexQuickSQLiteClient } from './KnexQuickSQLiteClient';
export type { Knex };

export type CreateTable = (knex: Knex) => Promise<void>;
export type Migration = {
  version: number;
  migration: (knex: Knex) => Promise<void>;
};

const checkDatabase = async (
  knex: Knex,
  newVersion: number
): Promise<number> => {
  const response = await knex.raw('PRAGMA user_version;');
  await knex.raw('PRAGMA foreign_keys = ON;');
  let oldVersion = response?.[0]?.user_version ?? 0;
  //if (oldVersion === 0) newVersion = -1;
  if (oldVersion !== newVersion) {
    await knex.raw(`PRAGMA user_version = ${newVersion};`);
  }
  return oldVersion;
};

export const initialize = async (params: {
  version: number;
  name?: string;
  debug?: boolean;
  createTables: CreateTable;
  migrations?: Migration[];
}): Promise<Knex> => {
  console.log('[Index.initialize]', params.version);
  const knex = new Knex(
    new NativeClient(
      {
        debug: params.debug ?? true,
        name: params.name ?? 'database.sqlite',
      },
      new KnexQuickSQLiteClient()
    )
  );

  const oldVersion = await checkDatabase(knex, params.version);
  console.log('[Index.checkDatabase]', { oldVersion, version: params.version });
  if (oldVersion === 0) await params.createTables(knex);
  if (oldVersion > params.version)
    throw new Error(
      `Passed version: ${params.version} must be greater the current version: ${oldVersion}`
    );
  if (oldVersion !== params.version) {
    if (params.migrations) {
      let start = oldVersion + 1;
      const m = new Map<number, Migration['migration']>();
      for (const migration of params.migrations) {
        m.set(migration.version, migration.migration);
      }
      while (start <= params.version) {
        console.log('[Index.while]', { start, version: params.version });
        if (m.has(start)) await m.get(start)?.(knex);
        start += 1;
      }
    }
  }

  return knex;
};
