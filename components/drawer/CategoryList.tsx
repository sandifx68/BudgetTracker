import React from "react";
import * as DBOController from "../../controllers/database/DatabaseOperationsController";
import { useNavigation } from "@react-navigation/native";
import DrawerItemList from "./DrawerItemList";
import PressableListItem from "../PressableListItem";

const CategoryList = () => {
  const addText = "Add a category";
  const addPage = "Add Category";
  const itemGetter = (db: any) => DBOController.getAllCategories(db);
  const navigation: any = useNavigation();

  const renderItem = (item: Category) => {
    return (
      <PressableListItem
        key={"CategoryListItem#" + item.id}
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
      renderItem={renderItem}
      addPage={addPage}
      addText={addText}
    />
  );
};

export default CategoryList;
