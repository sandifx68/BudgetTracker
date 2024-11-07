import React from "react";
import * as DBController from "../DatabaseController";
import { useNavigation } from "@react-navigation/native";
import DrawerItemList from "./DrawerItemList";
import PressableListItem from "../PressableListItem";

const ProfileList = () => {
  const addText = "Add a profile";
  const addPage = "Add Profile";
  const itemGetter = (db: any) => DBController.getAllProfiles(db);
  const navigation: any = useNavigation();
  const [currentProfileId, setCurrentProfileId] = React.useState<number>();

  React.useEffect(() => {
    DBController.getCurrentProfileId().then((profileId) => setCurrentProfileId(profileId));
  }, []);

  const handleSwitchProfile = (profileId: number) => {
    DBController.switchCurrentProfile(profileId);
    setCurrentProfileId(profileId);
    navigation.navigate("Expense List", { profileChanged: true });
  };

  const renderItem = (item: any) => {
    return (
      <PressableListItem
        selected={item.id == currentProfileId}
        name={item.name}
        selectThis={() => handleSwitchProfile(item.id)}
        rightAction={() => navigation.navigate(addPage, { profile: item, title: "Modify Profile" })}
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
