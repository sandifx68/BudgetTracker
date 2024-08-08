import { StyleSheet, Text, View, FlatList, Pressable, useWindowDimensions } from "react-native";
import React from "react";
import { useSQLiteContext } from "expo-sqlite/build";
import * as DBController from "../databaseController";
import DateSortedExpenses from "../DateSortedExpenses";
import MonthSortedExpenses from "../MonthSortedExpenses";

const ExpenseList = ({ navigation }: any): React.JSX.Element => {
  /**
   * Returns the amount of months between start date and end date.
   * @param startDate the start date
   * @param endDate the end date
   * @returns the amount of months between startDate and endDate.
   */
  const dateDifference = (startDate: Date, endDate: Date) => {
    return (
      startDate.getFullYear() * 12 +
      startDate.getMonth() -
      endDate.getFullYear() * 12 -
      endDate.getMonth()
    );
  };

  const db = useSQLiteContext();
  const [expensesPeriod, setPeriod] = React.useState<string>();
  const [expenses, setExpenses] = React.useState<Expense[][]>([]);
  const [sortMethod, setSortMethod] = React.useState<string>("date");

  const fetchExpenseCategoryName = async (expense: Expense): Promise<string> => {
    const categoryName = db.getFirstSync<Category>(
      "SELECT name FROM categories WHERE id = ?",
      expense.category_id,
    )?.name;

    if (categoryName) return categoryName;

    console.log(`No category found for ${expense.id}`);
    return "";
  };

  /**
   * Fetches all expenses in the database sorted by date added descendingly.
   * Then, adds them into a hashmap in order of time added. Finally, sets the expenses
   * to that hashmap in order to be displayed.
   */
  const fetchData = async () => {
    const result = await db.getAllAsync<Expense>("SELECT * FROM expenses ORDER BY date DESC");
    const expenseArray: Expense[][] = [...Array(60).keys()].map((i) => []);
    const currentDate = new Date();

    for (let x of result) {
      x.category_name = await fetchExpenseCategoryName(x);

      const expenseDate: Date = new Date(x.date);
      const index: number = dateDifference(currentDate, expenseDate);
      expenseArray[index].push(x);
    }

    setExpenses(expenseArray);
  };

  // Every time we are rereouted we want to refresh
  React.useEffect(() => {
    navigation.addListener("focus", () => {
      fetchData();
    });
  }, [navigation]);

  const toggleSortMethod = () => {
    if (sortMethod == "date") setSortMethod("category");
    else setSortMethod("date");
  };

  return (
    <View style={styles.container}>
      {/* List all expenses */}
      <View style={styles.expenseWrapper}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.sectionTitle}>All expenses</Text>

          <Pressable style={styles.buttonWrapper} onPress={() => DBController.resetDatabase()}>
            <Text>Reset database</Text>
          </Pressable>
        </View>

        <View style={styles.dateAndSortContainer}>
          <Text>Expenses for {expensesPeriod}</Text>

          <Pressable style={styles.sortWrapper} onPress={() => toggleSortMethod()}>
            <Text> Sort </Text>
          </Pressable>
        </View>

        {/* This is where all the expenses go! First flat list separates by month*/}
        <View style={styles.expenses}>
          <MonthSortedExpenses expenses={expenses} setPeriod={setPeriod} sortMethod={sortMethod} />
        </View>
      </View>

      {/* Button to add a new expense */}
      <View style={styles.writeExpenseWrapper}>
        <Pressable onPress={() => navigation.navigate("AddExpense")}>
          <View style={styles.buttonWrapper}>
            <Text> + </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 0,
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: "#E8EAED",
  },
  expenseWrapper: {
    paddingTop: 80,
    paddingHorizontal: 20,
    height: "80%",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
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
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  dateAndSortContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default ExpenseList;
