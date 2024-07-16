import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View } from "react-native";
import ExpensesList from "./components/ExpenseList";
import AddExpense from "./components/AddExpense";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import { SQLiteProvider } from "expo-sqlite/next";

const Stack = createNativeStackNavigator();

const loadDatabase = async () => {
  const dbName = "database.db";
  const dbAsset = require("./assets/database.db");
  const dbUri = Asset.fromModule(dbAsset).uri;
  const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

  const fileInfo = await FileSystem.getInfoAsync(dbFilePath);
  if (!fileInfo.exists) {
    await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}SQLite`, {
      intermediates: true,
    });
    await FileSystem.downloadAsync(dbUri, dbFilePath);
  }
};

export default function App() {
  const [dbLoaded, setDbLoaded] = React.useState(false);

  React.useEffect(() => {
    loadDatabase()
      .then(() => setDbLoaded(true))
      .catch((e) => console.error(e));
  }, []);

  if (!dbLoaded)
    return (
      <View style={{ flex: 1 }}>
        <ActivityIndicator size={"large"} />
      </View>
    );

  return (
    <NavigationContainer>
      <React.Suspense
        fallback={
          <View style={{ flex: 1 }}>
            <ActivityIndicator size={"large"} />
          </View>
        }
      >
        <SQLiteProvider databaseName="database.db" useSuspense>
          <Stack.Navigator>
            <Stack.Screen
              name="ExpenseList"
              component={ExpensesList}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen name="AddExpense" component={AddExpense} />
          </Stack.Navigator>
        </SQLiteProvider>
      </React.Suspense>
    </NavigationContainer>
  );
}
