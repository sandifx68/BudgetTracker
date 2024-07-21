import * as React from "react";
import { NavigationContainer, ParamListBase } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View, Text, Image, Pressable } from "react-native";
import ExpenseList from "./components/pages/ExpenseList";
import AddExpense from "./components/pages/AddExpense";
import AddExpenseHeader from "./components/AddExpenseHeader";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import { SQLiteProvider } from "expo-sqlite/next";
import Toast from "react-native-toast-message";

const Stack = createNativeStackNavigator();

const loadDatabase = async () => {
  //await removeDatabase()
  const dbName = "test.db";
  const dbAsset = require("./assets/test.db");
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

const removeDatabase = async () => {
  const sqlDir = FileSystem.documentDirectory + "SQLite/";
  await FileSystem.deleteAsync(sqlDir + "test.db", { idempotent: true });
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
    <>
      <NavigationContainer>
        <React.Suspense
          fallback={
            <View style={{ flex: 1 }}>
              <ActivityIndicator size={"large"} />
            </View>
          }
        >
          <SQLiteProvider
            databaseName="test.db"
            assetSource={{ assetId: require("./assets/test.db") }}
            useSuspense
          >
            <Stack.Navigator>
              <Stack.Screen
                name="ExpenseList"
                component={ExpenseList}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="AddExpense"
                component={AddExpense}
                options={({ route }) => ({
                  //headerBackVisible: false,
                  headerTitle: (props) => (
                    <AddExpenseHeader expense={(route.params as any)?.expense} />
                  ),
                })}
              />
            </Stack.Navigator>
          </SQLiteProvider>
        </React.Suspense>
      </NavigationContainer>
      <Toast />
    </>
  );
}
