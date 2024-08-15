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
      <View>
        <Pressable onPress={() => navigation.navigate("Add Category")}>
          <View style={styles.buttonWrapper}>
            <Text> Add a category </Text>
            <Text> + </Text>
          </View>
        </Pressable>
      </View>

      <View style={styles.categoriesWrapper}>
        <FlatList
          data={categories}
          renderItem={({ item }) => (
            <ExpenseCategoryComponent
              category={item}
              selectThis={() =>
                navigation.navigate("Add Category", { category: item, title: "Modify Category" })
              }
            />
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    //minHeight: 0,
    display: "flex",
    //justifyContent: "space-between",
    backgroundColor: "#E8EAED",
    alignItems: "flex-start",
  },
  buttonWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "gainsboro",
    width: "100%",
    paddingLeft: 10,
  },
  categoriesWrapper: {
    width: "100%",
    paddingHorizontal: 15,
    backgroundColor: "gray",
    borderColor: "#C0C0C0",
    borderWidth: 1,
  },
});

export default CategoryList;
