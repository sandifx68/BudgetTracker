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
import CustomDrawerContent from "./components/CustomDrawerContent";
import AddCategory from "./components/pages/addCategory/AddCategory";
import AddCategoryHeader from "./components/pages/addCategory/AddCategoryHeader";
import CustomHeader from "./components/CustomHeader";

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
            <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
              <Drawer.Screen
                name="Expense List"
                component={ExpenseList}
                initialParams={{ title: "Add Expense" }}
                options={({ route }) => ({
                  header: (props) => (
                    <CustomHeader
                      title={(route.params as any).title}
                      navigation={props.navigation}
                    />
                  ),
                })}
              />
              <Drawer.Screen
                name="Add Expense"
                component={AddExpense}
                initialParams={{ title: "Add Expense" }}
                options={({ route }) => ({
                  drawerItemStyle: { display: "none" },
                  header: (props) => (
                    <CustomHeader
                      title={(route.params as any).title}
                      navigation={props.navigation}
                    />
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
