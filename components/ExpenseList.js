import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Expense from "./Expense";

export default ExpensesList = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* List all expenses */}
      <View style={styles.expenseWrapper}>
        <Text style={styles.sectionTitle}>Add an expense!</Text>

        <View style={styles.expenses}>
          {/* This is where all the expenses go! */}
          <Expense description={"milk"} price={1.2} currency={"€"} category={"cooking"} />
          <Expense category={"on the go food"} price={2.69} currency={"€"} />

          {/* {taskItems.map((item, index) => {
            return <Expense key={index} description={item} />;
          })} */}
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
