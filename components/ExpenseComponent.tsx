import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface Props {
  expense: Expense;
}

const ExpenseComponent = (props: Props) => {
  const e = props.expense;

  return (
    <View style={styles.container}>
      <View>
        <Text>{e.category_name}</Text>
        <Text>{e.description}</Text>
      </View>
      <Text>
        {e.price} {e.currency ? e.currency : "€"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 20,
  },
});

export default ExpenseComponent;
