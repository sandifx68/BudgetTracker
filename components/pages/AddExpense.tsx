import React from "react";
import {
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import ExpenseCategoryComponent from "../ExpenseCategoryComponent";
import * as SQLite from "expo-sqlite";

const AddExpense = ({ route, navigation }: any) => {
  const expense: Expense = route.params?.expense;
  const [cost, setCost] = React.useState<string | undefined>(expense?.price.toString());
  const [description, setDescription] = React.useState<string | undefined>(expense?.description);
  const [categories, setCategories] = React.useState<Category[]>([]);

  const db = SQLite.useSQLiteContext();

  const addExpense = (cost: string, categoryId: number, description?: string) => {
    db.runSync(
      "INSERT INTO expenses (price, category_id, description) VALUES (?, ?, ?)",
      cost,
      categoryId,
      description ? description : null,
    );
  };

  const updateExpense = (cost: string, categoryId: number, description?: string) => {
    db.runSync(
      "UPDATE expenses SET price = ?, category_id = ?, description = ? WHERE id = ?",
      cost,
      categoryId,
      description || null,
      expense.id,
    );
  };

  const getAllCategories = async () => {
    return db.getAllAsync<Category>("SELECT * FROM categories");
  };

  const selectItem = (item: Category) => {
    setCategories(
      categories.map((i) => {
        i.is_selected = i.id == item.id ? !item.is_selected : false;
        return i;
      }),
    );
  };

  const handleAddExpense = () => {
    const categoryId = categories.find((i) => i.is_selected == true)?.id;
    if (!categoryId) {
      console.log("No category selected");
    } else if (!cost || Number.isNaN(cost)) {
      console.log("Invalid price provided!");
    } else {
      if (!expense) addExpense(cost, categoryId, description);
      else updateExpense(cost, categoryId, description);
      navigation.navigate("ExpenseList");
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      let result = await getAllCategories();
      result = result.map((c) => (expense?.category_id == c.id ? { ...c, is_selected: true } : c));
      setCategories(result);
    };
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      {/* Add a new expense */}
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder={"Cost"}
          value={cost}
          onChangeText={(value) => setCost(value)}
        />

        <TextInput
          style={styles.input}
          placeholder={"Description"}
          value={description?.toString()}
          onChangeText={(value) => setDescription(value)}
        />
      </KeyboardAvoidingView>

      {/* Fix error, make category selected by default
          Add way to delete added expense
          Add date to expense (by default added with date of today)
          Add date selector
          Add groupings by date
    */}
      <View style={styles.categoriesWrapper}>
        <FlatList
          data={categories}
          renderItem={({ item }) => (
            <ExpenseCategoryComponent category={item} selectThis={() => selectItem(item)} />
          )}
          keyExtractor={(item) => item.id.toString()}
          // extraData={this.state} might need this later
        />
      </View>

      <View style={styles.addExpenseButtonWrapper}>
        <TouchableOpacity onPress={() => handleAddExpense()}>
          <View style={styles.addWrapper}>
            <Text style={styles.addText}> {!expense ? "Add expense!" : "Modify Expense!"} </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#E8EAED",
    paddingTop: 60,
    flex: 1,
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: "#FFF",
    borderRadius: 60,
    borderColor: "#C0C0C0",
    borderWidth: 1,
    width: 250,
  },
  categoriesWrapper: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginTop: 15,
    backgroundColor: "#FFF",
    borderRadius: 30,
    borderColor: "#C0C0C0",
    borderWidth: 1,
    width: 250,
    height: 250,
  },
  addExpenseButtonWrapper: {
    position: "absolute",
    bottom: 60,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  addText: {
    textAlign: "center",
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    backgroundColor: "#FFF",
  },
});

export default AddExpense;
