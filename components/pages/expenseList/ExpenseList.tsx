import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";
import { useSQLiteContext } from "expo-sqlite/build";
import * as DBController from "../../DatabaseController";
import MonthSortedExpenses from "./MonthSortedExpenses";
import { useNavigation } from "@react-navigation/native";
import { calculateMonthlySpent, dateDifference } from "./ExpenseListLogic";

export function HeaderRightComponentExpenseList(): React.JSX.Element {
  //const db = useSQLiteContext();

  return (
    <Pressable
      style={styles.buttonWrapper}
      onPress={() => {
        DBController.resetDatabase();
        //DBController.populateDatabase(db);
      }}
    >
      <Text style={styles.resetDatabaseText}>🔄</Text>
    </Pressable>
  );
}

export function ExpenseList({ route }: any): React.JSX.Element {
  const db = useSQLiteContext();
  const [expensesPeriod, setPeriod] = React.useState<string>();
  const [monthlySpent, setMonthlySpent] = React.useState<number>(0);
  const [expenses, setExpenses] = React.useState<Expense[][]>([]);
  const [sortMethod, setSortMethod] = React.useState<string>("date");
  const navigation: any = useNavigation();
  const sortMethods = ["date", "category", "chart"];

  /**
   * Fetches the category name of an expense
   * @param expense the expense for which to fetch the category
   * @returns the category name as a promise
   */
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
   * Then, adds them into a matrix in order of time added. Finally, sets the expenses
   * to that matrix in order to be displayed.
   * @returns the matrix generated
   */
  const fetchData = async () => {
    const expenses = await DBController.getCurrentProfileId().then((id) =>
      DBController.getAllExpenses(db, id),
    );
    const expenseArray: Expense[][] = [...Array(60).keys()].map((i) => []);
    const currentDate = new Date();

    for (let x of expenses) {
      x.category_name = await fetchExpenseCategoryName(x);

      const expenseDate: Date = new Date(x.date);
      const index: number = dateDifference(currentDate, expenseDate);
      expenseArray[index].push(x);
    }

    setExpenses(expenseArray);
    if (expensesPeriod) setMonthlySpent(calculateMonthlySpent(expenseArray, expensesPeriod))
  };

  // Every time we are rereouted we want to refresh
  React.useEffect(() => {
    navigation.addListener("focus", () => {
      fetchData();
    });
  }, [navigation]);

  // Every time we switch profile
  React.useEffect(() => {
    if (route.params?.profileChanged === true) {
      navigation.setParams({ profileChanged: false });
      fetchData();
    }
  }, [route.params?.profileChanged]);

  const toggleSortMethod = () => {
    const methodIndex = sortMethods.findIndex((v) => v === sortMethod);
    setSortMethod(sortMethods[(methodIndex + 1) % sortMethods.length]);
  };

  return (
    <View style={styles.container}>
      {/* List all expenses */}
      <View style={styles.expenseWrapper}>
        <View style={styles.dateAndSortContainer}>
          <Text>Expenses for {expensesPeriod}</Text>

          <Pressable style={styles.sortWrapper} onPress={() => toggleSortMethod()}>
            <Text> Sort </Text>
          </Pressable>
        </View>

        {/* This is where all the expenses go! First flat list separates by month*/}
        <View style={styles.expenses}>
          <MonthSortedExpenses
            expenses={expenses}
            setPeriod={setPeriod}
            sortMethod={sortMethod}
            setMonthlySpent={setMonthlySpent}
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
