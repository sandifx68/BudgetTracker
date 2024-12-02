import React, { useCallback, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import ExpenseComponent from "./pages/expenseList/ExpenseComponent";
import { useTheme } from "@react-navigation/native";

interface Props {
  title: string;
  expenses: Expense[];
  width: number;
  totalPrice: number;
}

const ExpandableExpenseList = (props: Props) => {
  const [expanded, setExpanded] = useState<boolean>(true);
  const { colors } = useTheme();

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const renderItem = useCallback(
    ({ item }: { item: Expense }) => <ExpenseComponent expense={item} width={props.width} />,
    [],
  );

  return (
    <View
      style={{ ...styles.itemContainer, width: props.width, backgroundColor: colors.notification }}
    >
      <Pressable onPress={toggleExpand}>
        <View style={styles.titlePriceContainer}>
          <Text style={[styles.itemTitle, { color: colors.text }]}>{props.title}</Text>

          <Text style={[styles.price, { color: colors.text }]}>
            {" "}
            {props.totalPrice?.toFixed(2)}{" "}
          </Text>
        </View>
      </Pressable>
      {expanded && (
        <FlatList
          data={props.expenses}
          initialNumToRender={50}
          renderItem={renderItem}
          keyExtractor={(item) => "Expense" + item.id.toString()}
          getItemLayout={(data, index) => ({
            length: props.width,
            offset: props.width * index,
            index,
          })}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: "gainsboro",
    borderRadius: 10,
    marginBottom: 10,
    paddingBottom: 20,
    overflow: "hidden",
  },
  itemTitle: {
    marginLeft: 5,
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  titlePriceContainer: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  price: {
    marginRight: 10,
  },
});

export default ExpandableExpenseList;
