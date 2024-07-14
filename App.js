import * as React from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ExpensesList from "./components/ExpenseList";
import AddExpense from "./components/AddExpense";
import * as SQLite from "expo-sqlite";

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
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
    </NavigationContainer>
  );
}

export default App;
