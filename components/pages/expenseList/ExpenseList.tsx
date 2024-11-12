import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";
import MonthSortedExpenses from "./MonthSortedExpenses";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  createDateFromIndex,
  createMonthYearKey,
} from "../../../controllers/expenseList/ExpenseListController";
import * as DBO from "../../../controllers/database/DatabaseOperationsController";
import { SQLiteAnyDatabase } from "expo-sqlite/build/NativeStatement";
import { useSQLiteContext } from "expo-sqlite";

export function ExpenseList({ route }: any): React.JSX.Element {
  const [monthIndex, setMonthIndex] = React.useState<number>(0);
  const [monthlySpent, setMonthlySpent] = React.useState<number>(0);
  const [sortMethod, setSortMethod] = React.useState<string>("date");
  const [profile, setProfile] = React.useState<Profile>();
  const navigation: any = useNavigation();
  const db: SQLiteAnyDatabase = useSQLiteContext();
  const sortMethods = ["date", "category", "chart"];

  const fetchProfile = async () => {
    const fetchedProfile = await DBO.getCurrentProfileId().then((id) => DBO.getProfile(db, id));
    if (fetchedProfile) setProfile(fetchedProfile);
  };

  // When we load the app, we want to fetch the profile
  React.useEffect(() => {
    fetchProfile();
  }, []);

  // Every time we switch profile
  React.useEffect(() => {
    if (route.params?.profileChanged === true) {
      navigation.setParams({ profileChanged: false });
      fetchProfile();
    }
  }, [route.params?.profileChanged]);

  // Every time the month changes
  React.useEffect(() => {
    const date = createDateFromIndex(monthIndex);
    setMonthlySpent(DBO.getExpenseSumPerMonth(db, date, profile?.id ?? 0));
  }, [monthIndex]);

  // Everytime we come into focus
  useFocusEffect(
    React.useCallback(() => {
      const date = createDateFromIndex(monthIndex);
      setMonthlySpent(DBO.getExpenseSumPerMonth(db, date, 4));
    }, []),
  );

  const toggleSortMethod = () => {
    const methodIndex = sortMethods.findIndex((v) => v === sortMethod);
    setSortMethod(sortMethods[(methodIndex + 1) % sortMethods.length]);
  };

  return (
    <View style={styles.container}>
      {/* List all expenses */}
      <View style={styles.expenseWrapper}>
        <View style={styles.dateAndSortContainer}>
          <Text>Expenses for {createMonthYearKey(monthIndex)}</Text>

          <Pressable style={styles.sortWrapper} onPress={() => toggleSortMethod()}>
            <Text> Sort </Text>
          </Pressable>
        </View>

        {/* This is where all the expenses go! First flat list separates by month*/}
        <View style={styles.expenses}>
          <MonthSortedExpenses
            profile={profile}
            setMonthIndex={setMonthIndex}
            sortMethod={sortMethod}
          />
        </View>

        <View style={styles.spentContainer}>
          <Text style={styles.spent}> Spent: {monthlySpent.toFixed(2)} € </Text>
        </View>
      </View>

      {/* Button to add a new expense */}
      <View style={styles.writeExpenseWrapper}>
        <Pressable onPress={() => navigation.navigate("Add Expense")}>
          <View style={styles.buttonWrapper}>
            <Text> + </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: "#E8EAED",
  },
  expenseWrapper: {
    paddingHorizontal: 20,
    height: "74%",
  },
  headerLeftContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  hamburgerMenu: {
    fontSize: 30,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "white",
    borderRadius: 10,
  },
  resetDatabaseText: {
    textAlign: "center",
  },
  expenses: {
    marginTop: 15,
    borderColor: "dimgray",
    borderWidth: 5,
    borderRadius: 10,
    height: "85%",
  },
  writeExpenseWrapper: {
    height: "20%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonWrapper: {
    width: 60,
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  sortWrapper: {
    borderColor: "gray",
    borderWidth: 3,
    borderRadius: 10,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  dateAndSortContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  spentContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  spent: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    borderColor: "gray",
    borderWidth: 3,
    borderRadius: 10,
    width: 200,
  },
});
