import * as React from 'react';

import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { init } from './initDB';
import type { Knex } from 'react-native-knex';

interface Search {
  readonly id: number;
  readonly query: string;
}

export default function App() {
  const [db, setDb] = React.useState<Knex | undefined>();

  React.useEffect(() => {
    const i = async () => {
      setDb(await init());
    };
    i();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={async () => {
          const response = await db!
            .table<Search>('search')
            .where({ query: 's' })
            .where('query', 'ww')
            .first();
        }}
      >
        <Text>Make query</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
