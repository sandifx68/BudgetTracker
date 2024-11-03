import * as React from "react";
import { ExpenseList, HeaderRightComponentExpenseList } from "./pages/expenseList/ExpenseList";
import { AddExpense, HeaderRightComponentAddExpense } from "./pages/addExpense/AddExpense";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawerContent from "./drawer/CustomDrawerContent";
import { AddCategory, HeaderRightComponentAddCategory } from "./pages/addCategory/AddCategory";
import CustomHeader from "./CustomHeader";

//const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export default function ScreenList() {
  return (
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
                <HeaderRightComponentAddCategory category={(route.params as any).category} />
              }
            />
          ),
        })}
      />
    </Drawer.Navigator>
  );
}
