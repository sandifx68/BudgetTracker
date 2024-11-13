import { useNavigation } from "@react-navigation/native";
import React, { memo } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

interface Props {
  expense: Expense;
  width: number;
}

const ExpenseComponent = memo(
  (props: Props) => {
    const e = props.expense;
    const navigation: any = useNavigation();

    return (
      <Pressable
        onPress={() => navigation.navigate("Add Expense", { expense: e, title: "Modify Expense!" })}
        style={{ width: props.width }} //subtracted border and padding
      >
        <View style={styles.container}>
          <View>
            <Text>{e.category_name}</Text>
            <Text>{e.description}</Text>
          </View>
          <Text>
            {e.price} {e.profile_currency ? e.profile_currency : "€"}
          </Text>
        </View>
      </Pressable>
    );
  },
  (prevProps: Props, nextProps: Props) => {
    return (
      prevProps.expense === nextProps.expense // Only re-render if expense changes
    );
  },
);

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginTop: 20,
  },
});

export default ExpenseComponent;
