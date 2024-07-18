import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

interface Props {
  expense: Expense;
}

const ExpenseComponent = (props: Props) => {
  const e = props.expense;
  const navigation: any = useNavigation();

  return (
    <Pressable
      onPress={() => {
        navigation.navigate("AddExpense", { expense: e });
      }}
    >
      <View style={styles.container}>
        <View>
          <Text>{e.category_name}</Text>
          <Text>{e.description}</Text>
        </View>
        <Text>
          {e.price} {e.currency ? e.currency : "€"}
        </Text>
      </View>
    </Pressable>
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
