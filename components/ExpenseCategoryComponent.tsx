import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native";

interface Props {
  category: Category;
  selectThis: () => void;
}

const ExpenseCategoryComponent = (props: Props) => {
  return (
    <TouchableOpacity
      style={[styles.container, props.category.is_selected ? styles.selected : {}]}
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

export default ExpenseCategoryComponent;
