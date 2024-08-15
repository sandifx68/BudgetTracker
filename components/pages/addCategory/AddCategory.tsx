import React from "react";
import { View, Text, Pressable } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";

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
  const category: Category = route.params?.category;
  const db = useSQLiteContext();

  return (
    <View>
      <Text> {category.name} </Text>
    </View>
  );
}
