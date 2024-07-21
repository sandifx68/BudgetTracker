import { useNavigation } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite";
import React from "react";
import { View, Text, Pressable } from "react-native";

const AddExpenseHeader = (props: any) => {
  const db = useSQLiteContext();
  const navigation: any = useNavigation();

  const deleteExpense = () => {
    db.runSync("DELETE FROM expenses WHERE id = ?", props.expense.id);
    navigation.navigate("ExpenseList");
  };

  return (
    <View
      style={{
        marginLeft: 0,
        width: "90%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Text style={{}}>{/* {props.modify ? "Modify expense!" : "Add an expense!"} */}</Text>
      <Pressable onPress={() => deleteExpense()}>
        {/* <Image source={require('./assets/trash.jpg')} style={{height: 'auto', width: 'auto'}}/> */}
        <Text>Delete expense.</Text>
      </Pressable>
    </View>
  );
};

export default AddExpenseHeader;
