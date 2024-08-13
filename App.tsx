import "./gesture-handler";
import * as React from "react";
import { NavigationContainer, ParamListBase } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View, Text, Image, Pressable } from "react-native";
import ExpenseList from "./components/pages/expenseList/ExpenseList";
import AddExpense from "./components/pages/addExpense/AddExpense";
import AddExpenseHeader from "./components/pages/addExpense/AddExpenseHeader";
import { SQLiteProvider } from "expo-sqlite/next";
import Toast from "react-native-toast-message";
import * as DBController from "./components/databaseController";
import CategoryList from "./components/pages/categoryList/CategoryList";
import { createDrawerNavigator } from "@react-navigation/drawer";

//const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
  const [dbLoaded, setDbLoaded] = React.useState(false);

  React.useEffect(() => {
    DBController.loadDatabase()
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
            <Drawer.Navigator>
              <Drawer.Screen
                name="Expense List"
                component={ExpenseList}
                options={{
                  headerShown: false,
                }}
              />
              <Drawer.Screen name="Category List" component={CategoryList} />
              <Drawer.Screen
                name="Add Expense"
                component={AddExpense}
                options={({ route }) => ({
                  //headerBackVisible: false,
                  headerTitle: (props) => (
                    <AddExpenseHeader expense={(route.params as any)?.expense} />
                  ),
                })}
              />
            </Drawer.Navigator>
          </SQLiteProvider>
        </React.Suspense>
      </NavigationContainer>
      <Toast />
    </>
  );
}
