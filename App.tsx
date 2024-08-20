import "./gesture-handler";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { ActivityIndicator, View } from "react-native";
import {
  ExpenseList,
  HeaderRightComponentExpenseList,
} from "./components/pages/expenseList/ExpenseList";
import {
  AddExpense,
  HeaderRightComponentAddExpense,
} from "./components/pages/addExpense/AddExpense";
import { SQLiteProvider } from "expo-sqlite/next";
import Toast from "react-native-toast-message";
import * as DBController from "./components/DatabaseController";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawerContent from "./components/CustomDrawerContent";
import {
  AddCategory,
  HeaderRightComponentAddCategory,
} from "./components/pages/addCategory/AddCategory";
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
                initialParams={{ title: "Expense List" }}
                options={({ route }) => ({
                  header: (props) => (
                    <CustomHeader
                      title={(route.params as any).title}
                      navigation={props.navigation}
                      rightComponent={<HeaderRightComponentExpenseList />}
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
                      rightComponent={
                        <HeaderRightComponentAddExpense expense={(route.params as any).expense} />
                      }
                    />
                  ),
                })}
              />
              <Drawer.Screen
                name="Add Category"
                component={AddCategory}
                initialParams={{ title: "Add Category" }}
                options={({ route }) => ({
                  drawerItemStyle: { display: "none" },
                  header: (props) => (
                    <CustomHeader
                      title={(route.params as any).title}
                      navigation={props.navigation}
                      rightComponent={
                        <HeaderRightComponentAddCategory
                          category={(route.params as any).category}
                        />
                      }
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
