import React from "react";
import { FlatList, Text, StyleSheet, View, Pressable } from "react-native";
import ExpenseCategoryComponent from "../../ExpenseCategoryComponent";
import * as SQLite from "expo-sqlite";
import * as DBController from "../../databaseController";

const CategoryList = ({ navigation }: any) => {
  const db = SQLite.useSQLiteContext();
  const [categories, setCategories] = React.useState<Category[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      let result = await DBController.getAllCategories(db);
      setCategories(result);
    };
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.categoriesWrapper}>
        <FlatList
          data={categories}
          renderItem={({ item }) => (
            <ExpenseCategoryComponent category={item} selectThis={() => console.log(item.name)} />
          )}
          keyExtractor={(item) => item.id.toString()}
          // extraData={this.state} might need this later
        />
      </View>

      <View style={styles.addCategoryWrapper}>
        <Pressable onPress={() => navigation.navigate("AddExpense")}>
          <View style={styles.buttonWrapper}>
            <Text> + </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 0,
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: "#E8EAED",
    alignItems: "center",
  },
  buttonWrapper: {
    width: 60,
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  addCategoryWrapper: {
    height: "20%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
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
});

export default CategoryList;
