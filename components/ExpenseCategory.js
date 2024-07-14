import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native";

const ExpenseCategory = (props) => {
  return (
    <TouchableOpacity
      style={[styles.container, props.category.isSelected ? styles.selected : {}]}
      onPress={() => props.selectThis()}
    >
      <Text>{props.category.name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    borderRadius: 10,
  },
  selected: {
    backgroundColor: "#FA7B5F",
  },
});

export default ExpenseCategory;
