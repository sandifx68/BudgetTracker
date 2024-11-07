import React from "react";
import * as DBController from "../DatabaseController";
import { useNavigation } from "@react-navigation/native";
import DrawerItemList from "./DrawerItemList";
import PressableListItem from "../PressableListItem";

const CategoryList = () => {
  const addText = "Add a category";
  const addPage = "Add Category";
  const itemGetter = (db: any) => DBController.getAllCategories(db);
  const navigation: any = useNavigation();

  const renderItem = (item: any) => {
    return (
      <PressableListItem
        name={item.name}
        selectThis={() =>
          navigation.navigate("Add Category", { category: item, title: "Modify Category" })
        }
      />
    );
  };

  return (
    <DrawerItemList
      itemGetter={itemGetter}
      addPage={addPage}
      addText={addText}
      renderItem={renderItem}
    />
  );
};

export default CategoryList;
