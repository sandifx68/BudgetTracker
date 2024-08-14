import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

interface Props {
  expense: Expense;
  width: number;
}

const ExpenseComponent = (props: Props) => {
  const e = props.expense;
  const navigation: any = useNavigation();

  return (
    <Pressable
      onPress={() => {
        navigation.navigate("Add Expense", { expense: e });
      }}
      style={{ width: props.width }} //subtracted border and padding
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
    //width: 400,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginTop: 20,
  },
});

export default ExpenseComponent;
