import { StyleSheet, Text, View, FlatList, Pressable } from "react-native";
import React from "react";
import ExpenseComponent from "../ExpenseComponent";
import { useSQLiteContext } from "expo-sqlite/build";
import * as DBController from "../databaseController";
import * as Updates from "expo-updates";

const ExpenseList = ({ navigation }: any): React.JSX.Element => {
  const db = useSQLiteContext();
  const [expenses, setExpenses] = React.useState<Expense[]>([]);

  const fetchData = async () => {
    const result = await db.getAllAsync<Expense>("SELECT * FROM expenses");
    setExpenses(result);
  };

  const resetDatabase = async () => {
    DBController.removeDatabase().then(() => DBController.loadDatabase());
    //.then(() => Updates.reloadAsync())) needs restart, don't want to do that now
  };

  // Every time we are rereouted we want to refresh
  React.useEffect(() => {
    navigation.addListener("focus", () => {
      fetchData();
    });
  }, [navigation]);

  /**
   * Render a expense component given an expense
   *
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

    return <ExpenseComponent expense={item} />;
  };

  return (
    <View style={styles.container}>
      {/* List all expenses */}
      <View style={styles.expenseWrapper}>
        <View style={styles.headerContainer}>
          <Text style={styles.sectionTitle}>All expenses</Text>

          <Pressable style={styles.buttonWrapper} onPress={() => resetDatabase()}>
            <Text>Reset database</Text>
          </Pressable>
        </View>

        <View style={styles.expenses}>
          {/* This is where all the expenses go! */}
          <FlatList
            data={expenses}
            renderItem={({ item }) => renderExpense(item)}
            keyExtractor={(item) => item.id.toString()}
            // extraData={this.state} might need this later
          />
        </View>
      </View>

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
    marginTop: 30,
    borderColor: "dimgray",
    borderWidth: 5,
    borderRadius: 10,
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
});

export default ExpenseList;
