import { QuickSQLite } from 'react-native-quick-sqlite';

class _KnexQuickSQLiteClient {
  constructor(private dbName: string) {}

  executeSql = (statement: string, params: any[]) => {
    return new Promise((resolve) => {
      QuickSQLite.asyncExecuteSql(this.dbName, statement, params, (res) => {
        resolve({
          insertId: res.insertId,
          rowsAffected: res.rowsAffected,
          rows: res.rows?._array ?? [],
        });
      });
    });
  };
}

export class KnexQuickSQLiteClient {
  constructor() {}

  openDatabase = (params: { name: string }): _KnexQuickSQLiteClient => {
    try {
      const dbOpenResult = QuickSQLite.open(params.name);
      console.log(
        '[KnexQuickSqLiteClient.openDatabase]',
        params.name,
        dbOpenResult.status,
        dbOpenResult.message
      );
      if (dbOpenResult.status === 1) throw new Error(dbOpenResult.message);
      console.log('db opened');
      return new _KnexQuickSQLiteClient(params.name);
    } catch (e) {
      console.log('error open db', e);
      throw e;
    }
  };
}
