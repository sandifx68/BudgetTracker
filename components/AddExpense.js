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
  ActivityIndicator,
} from "react-native";
import ExpenseCategory from "./ExpenseCategory";
import * as SQLite from "expo-sqlite";

export default AddExpense = ({ navigation }) => {
  const [cost, setCost] = React.useState();
  const [dataSource, setDatasource] = React.useState([]);
  const db = SQLite.useSQLiteContext();

  const selectItem = (item) => {
    setDatasource(
      dataSource.map((i) => {
        i.isSelected = i.id == item.id ? !item.isSelected : false;
        return i;
      }),
    );
  };

  const handleAddExpense = () => {
    const categoryId = dataSource.find((i) => i.isSelected == true);
    console.log(cost, categoryId);
    db.runSync("INSERT INTO expenses (price, category_id) VALUES (?, ?)", cost, categoryId);
    navigation.navigate("ExpenseList");
  };

  React.useEffect(() => {
    const fetchData = async () => {
      const result = await db.getAllAsync("SELECT * FROM categories");
      setDatasource(result);
    };
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      {/* Add a new expense */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        // style={styles.writeExpenseWrapper}
      >
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder={"Cost"}
          value={cost}
          onChangeText={(value) => setCost(value)}
        />
      </KeyboardAvoidingView>

      <View style={styles.categoriesWrapper}>
        <FlatList
          data={dataSource}
          renderItem={({ item }) => (
            <ExpenseCategory category={item} selectThis={() => selectItem(item)} />
          )}
          keyExtractor={(item) => item.id.toString()}
          // extraData={this.state} might need this later
        />
      </View>

      <View style={styles.addExpenseButtonWrapper}>
        <TouchableOpacity onPress={() => handleAddExpense()}>
          <View style={styles.addWrapper}>
            <Text style={styles.addText}> Add expense! </Text>
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
