import { StyleSheet, Text, TouchableOpacity, View, FlatList } from "react-native";
import React from "react";
import Expense from "./Expense";
import { useSQLiteContext } from "expo-sqlite/build";

export default ExpensesList = ({ navigation }) => {
  const db = useSQLiteContext();
  const [dataSource, setDatasource] = React.useState([]);

  const fetchData = async () => {
    const result = await db.getAllAsync("SELECT * FROM expenses");
    setDatasource(result);
  };

  // Every time we are rereouted we want to refresh
  React.useEffect(() => {
    navigation.addListener("focus", () => {
      fetchData();
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* List all expenses */}
      <View style={styles.expenseWrapper}>
        <Text style={styles.sectionTitle}>All expenses</Text>

        <View style={styles.expenses}>
          {/* This is where all the expenses go! */}
          <FlatList
            data={dataSource}
            renderItem={({ item }) => {
              const categoryName = db.getFirstSync(
                "SELECT name FROM categories WHERE id = ?",
                item.category_id,
              ).name;
              return (
                <Expense
                  description={item.description}
                  price={item.price}
                  currency={"€"}
                  category={categoryName}
                />
              );
            }}
            keyExtractor={(item) => item.id.toString()}
            // extraData={this.state} might need this later
          />
        </View>
      </View>

      <View style={styles.writeExpenseWrapper}>
        <TouchableOpacity onPress={() => navigation.navigate("AddExpense")}>
          <View style={styles.addWrapper}>
            <Text style={styles.addText}> + </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8EAED",
  },
  expenseWrapper: {
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  expenses: {
    marginTop: 30,
  },
  writeExpenseWrapper: {
    position: "absolute",
    bottom: 60,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
});
