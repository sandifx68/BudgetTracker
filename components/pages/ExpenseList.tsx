import { StyleSheet, Text, View, FlatList, Pressable, useWindowDimensions } from "react-native";
import React from "react";
import ExpenseComponent from "../ExpenseComponent";
import { useSQLiteContext } from "expo-sqlite/build";
import * as DBController from "../databaseController";
import exp from "constants";
import ExpandableList from "../ExpandableList";

const ExpenseList = ({ navigation }: any): React.JSX.Element => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  /**
   * Creates a key representing the month and year given the index.
   * @param index the index representing the distance in months from the current date.
   * @returns the date as a string (i.e. Aug 2023)
   */
  const createMonthKey = (index: number): string => {
    const currMonth = new Date().getMonth();
    const currYear = new Date().getFullYear();
    const month = (12 + ((currMonth - index) % 12)) % 12;
    const year = currYear - Math.floor((index - currMonth - 1) / 12 + 1);
    return months[month] + " " + year.toString();
  };

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

  /**
   * Gives st, th or nd based on the date
   * @param day the day
   * @returns st, th or nd based on the date
   */
  const nth = (day: number) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const { height, width } = useWindowDimensions();
  const EXPENSE_WIDTH = width - 50;

  const db = useSQLiteContext();
  const [expensesPeriod, setPeriod] = React.useState<string>(createMonthKey(0));
  const [expenses, setExpenses] = React.useState<Expense[][]>([]);

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

  /**
   * Render a expense component given an expense
   * @param {Expense} item the item to be turned to a component
   * @returns {ExpenseComponent} the expense component
   */
  const renderExpense = (item: Expense) => {
    const categoryName = db.getFirstSync<Category>(
      "SELECT name FROM categories WHERE id = ?",
      item.category_id,
    )?.name;

    if (categoryName) item.category_name = categoryName;
    else console.log(`No category found for ${item.id}`);

    return <ExpenseComponent expense={item} width={EXPENSE_WIDTH} />;
  };

  /**
   * Given a list of expenses, separate them in a 2d array, the first dimension
   * representing the day of the expense
   * @param expenses the expenses to be separated
   * @returns 2d array of expenses, with the first dimension being the day of the expense
   */
  const collectExpensesPerDay = (expenses: Expense[]): Expense[][] => {
    let days: Expense[][] = [...Array(32).keys()].map((i) => []);
    for (const e of expenses) {
      const expenseDay = new Date(e.date).getDate();
      days[expenseDay].push(e);
    }
    return days;
  };

  /**
   * Render expenses of a certain day in an expandable list
   * @param expenses expenses in a day
   * @param day the day of the expenses
   * @returns ExpandableList with the expenses of that day
   */
  const renderExpensesDay = (expenses: Expense[], day: number) => {
    if (expenses.length == 0) return null;

    let innerComponent = (
      <FlatList
        data={expenses}
        renderItem={({ item }) => renderExpense(item)}
        keyExtractor={(item) => "Expense" + item.id.toString()}
        getItemLayout={(data, index) => ({
          length: EXPENSE_WIDTH,
          offset: EXPENSE_WIDTH * index,
          index,
        })}
      />
    );

    return (
      <ExpandableList
        innerComponent={innerComponent}
        title={day + nth(day) + " of the month"}
        width={EXPENSE_WIDTH}
      />
    );
  };

  /**
   * Returns a vertical flat list of all expenses separated in expandable lists per day.
   * @param expenses expenses to be rendered in flat list
   * @returns vertical flat list of expenses
   */
  const renderExpensesMonth = (expenses: Expense[], month: number) => {
    if (expenses.length == 0)
      return (
        <View style={{ width: EXPENSE_WIDTH, ...styles.emptyExpenseListContainer }}>
          <Text> There are no records for this period. </Text>
        </View>
      );

    return (
      <FlatList
        data={collectExpensesPerDay(expenses)}
        renderItem={({ item, index }) => renderExpensesDay(item, index)}
        keyExtractor={(item, index) => `Month ${month} day ${index}`}
        initialNumToRender={50}
        ListEmptyComponent={
          <View style={{ width: EXPENSE_WIDTH, ...styles.emptyExpenseListContainer }}>
            <Text> There are no records for this period. </Text>
          </View>
        }
      />
    );
  };

  const onViewableItemsChangedHandler = ({ viewableItems, changed }: any) => {
    if (viewableItems.length > 0) {
      const date = viewableItems[0].key;
      setPeriod(date);
    }
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

        <Text>Expenses for {expensesPeriod}</Text>

        {/* This is where all the expenses go! First flat list separates by month*/}
        <View style={styles.expenses}>
          <FlatList
            data={expenses}
            renderItem={({ item, index }) => renderExpensesMonth(item, index)}
            keyExtractor={(item, index) => createMonthKey(index)}
            horizontal
            pagingEnabled
            inverted
            bounces={false}
            viewabilityConfig={{
              viewAreaCoveragePercentThreshold: 50,
            }}
            onViewableItemsChanged={onViewableItemsChangedHandler}
          />
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
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  emptyExpenseListContainer: {
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  },
});

export default ExpenseList;
