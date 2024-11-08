import * as React from "react";
import { ExpenseList, HeaderRightComponentExpenseList } from "./pages/expenseList/ExpenseList";
import { AddExpense } from "./pages/addExpense/AddExpense";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawerContent from "./drawer/CustomDrawerContent";
import { AddCategory } from "./pages/addCategory/AddCategory";
import CustomHeader from "./CustomHeader";
import { HeaderRightComponent } from "./HeaderRightComponent";
import { AddProfile } from "./pages/addProfile/AddProfile";
import ImportDatabase from "./pages/importDatabase/ImportDatabase";

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
                <HeaderRightComponent
                  itemId={(route.params as any).expense?.id}
                  itemName={"expense"}
                  tableName={"expenses"}
                  screenName={"Expense List"}
                />
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
                <HeaderRightComponent
                  itemId={(route.params as any).category?.id}
                  itemName={"category"}
                  tableName={"categories"}
                  screenName={"Expense List"}
                />
              }
            />
          ),
        })}
      />
      <Drawer.Screen
        name="Add Profile"
        component={AddProfile}
        initialParams={{ title: "Add Profile" }}
        options={({ route }) => ({
          drawerItemStyle: { display: "none" },
          header: (props) => (
            <CustomHeader
              title={(route.params as any).title}
              navigation={props.navigation}
              rightComponent={
                <HeaderRightComponent
                  itemId={(route.params as any).category?.id}
                  itemName={"profile"}
                  tableName={"profiles"}
                  screenName={"Expense List"}
                />
              }
            />
          ),
        })}
      />
      <Drawer.Screen
        name="Import Database"
        component={ImportDatabase}
        initialParams={{ title: "Import Database" }}
        options={({ route }) => ({
          header: (props) => (
            <CustomHeader title={(route.params as any).title} navigation={props.navigation} />
          ),
        })}
      />
    </Drawer.Navigator>
  );
}
