import React from "react";
import * as DBController from "../DatabaseController";
import { useNavigation } from "@react-navigation/native";
import DrawerItemList from "./DrawerItemList";
import PressableListItem from "../PressableListItem";

const ProfileList = () => {
  const addText = "Add a profile";
  const addPage = "Add Profile";
  const itemGetter = (db: any) => DBController.getAllCategories(db);
  const navigation: any = useNavigation();

  const renderItem = (item: any) => {
    return (
      <PressableListItem
        name={item.name}
        selectThis={() => console.log("Profile switched")}
        rightAction={() => navigation.navigate(addPage, { category: item, title: "Modify Profile" })}
        rightText="✏️"
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

export default ProfileList;
