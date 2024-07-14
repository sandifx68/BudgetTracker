import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Expense = (props) => {
  return (
    <View style={styles.container}>
      <View>
        <Text>{props.category}</Text>
        <Text>{props.description}</Text>
      </View>
      <Text>
        {props.price} {props.currency}
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

export default Expense;
