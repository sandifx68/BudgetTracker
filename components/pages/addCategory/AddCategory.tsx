import React from "react";
import { View, Text, Pressable, KeyboardAvoidingView, StyleSheet, Platform } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { TextInput } from "react-native-gesture-handler";

export function HeaderRightComponentAddCategory({ category }: any): React.JSX.Element | undefined {
  const db = useSQLiteContext();
  const navigation: any = useNavigation();

  const deleteCategory = () => {
    db.runSync("DELETE FROM categories WHERE id = ?", category.id);
    navigation.navigate("Expense List");
  };

  if (category)
    return (
      <Pressable onPress={() => deleteCategory()}>
        {/* <Image source={require('./assets/trash.jpg')} style={{height: 'auto', width: 'auto'}}/> */}
        <Text>Delete category.</Text>
      </Pressable>
    );
}

export function AddCategory({ route, navigation }: any): React.JSX.Element {
  const db = useSQLiteContext();
  const [category, setCategory] = React.useState<Category>();

  React.useEffect(() => {
    setCategory(route.params?.category);
  }, [route]);

  const addCategory = (name: string) => {
    db.runSync("INSERT INTO categories (name) VALUES (?)", name);
  };

  const updateCategory = (name: string, id: number) => {
    db.runSync("UPDATE categories SET name = ? WHERE id = ?", name, id);
  };

  const handleAddCategory = () => {
    if (category?.name) {
      if (!category.id) {
        addCategory(category.name);
        Toast.show({
          type: "success",
          text1: "Category successfully added!",
        });
      } else {
        updateCategory(category.name, category.id);
        Toast.show({
          type: "info",
          text1: "Category successfully modified!",
        });
      }
      navigation.navigate("Expense List");
    } else {
      Toast.show({
        type: "error",
        text1: "Category name can't be empty!",
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Add a new category */}

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <TextInput
          style={styles.input}
          placeholder={"Category name"}
          value={category?.name}
          onChangeText={(value) => setCategory({ ...(category as Category), name: value })}
        />
      </KeyboardAvoidingView>

      <View style={styles.addCategoryButtonWrapper}>
        <Pressable onPress={() => handleAddCategory()}>
          <View style={styles.addWrapper}>
            <Text style={styles.addText}> {!category ? "Add Category!" : "Modify Category!"} </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

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
  addCategoryButtonWrapper: {
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
});
