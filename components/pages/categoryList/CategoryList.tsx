import React from "react";
import { FlatList, Text, StyleSheet, View, Pressable } from "react-native";
import ExpenseCategoryComponent from "../../ExpenseCategoryComponent";
import * as SQLite from "expo-sqlite";
import * as DBController from "../../DatabaseController";
import { useNavigation } from "@react-navigation/native";
import { useDrawerStatus } from "@react-navigation/drawer";

const CategoryList = () => {
  const db = SQLite.useSQLiteContext();
  const [categories, setCategories] = React.useState<Category[]>([]);
  const navigation: any = useNavigation();

  const isDrawerOpen = useDrawerStatus() === "open";

  const fetchData = async () => {
    let result = await DBController.getAllCategories(db);
    setCategories(result);
  };

  // Every time we open the drawer we want to refresh
  React.useEffect(() => {
    if (isDrawerOpen) fetchData();
  }, [isDrawerOpen]);

  return (
    <View style={styles.container}>
      <View>
        <Pressable onPress={() => navigation.navigate("Add Category")}>
          <View style={styles.buttonWrapper}>
            <Text style={styles.addText}> Add a category </Text>
            <Text style={styles.addText}> + </Text>
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
  addText: {
    fontSize: 24,
  },
});

export default CategoryList;
