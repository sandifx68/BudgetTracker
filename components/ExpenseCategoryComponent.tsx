import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

interface Props {
  category: Category;
  selectThis: () => void;
}

const ExpenseCategoryComponent = (props: Props) => {
  return (
    <Pressable
      style={[styles.container, props.category.is_selected ? styles.selected : {}]}
      onPress={() => props.selectThis()}
    >
      <Text style={styles.categoryText}>{props.category.name}</Text>
    </Pressable>
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
  categoryText: {
    fontSize: 24,
  },
});

export default ExpenseCategoryComponent;
