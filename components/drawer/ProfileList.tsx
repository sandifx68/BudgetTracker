import React from "react";
import * as DBOController from "../../controllers/database/DatabaseOperationsController";
import { useNavigation } from "@react-navigation/native";
import DrawerItemList from "./DrawerItemList";
import PressableListItem from "../PressableListItem";
import { it } from "node:test";

const ProfileList = () => {
  const addText = "Add a profile";
  const addPage = "Add Profile";
  const itemGetter = (db: any) => DBOController.getAllProfiles(db);
  const navigation: any = useNavigation();
  const [currentProfileId, setCurrentProfileId] = React.useState<number>();

  React.useEffect(() => {
    DBOController.getCurrentProfileId().then((profileId) => setCurrentProfileId(profileId));
  }, []);

  const handleSwitchProfile = (profileId: number) => {
    DBOController.switchCurrentProfile(profileId);
    setCurrentProfileId(profileId);
    navigation.navigate("Expense List", { newProfile: profileId });
  };

  const renderItem = (item: Profile) => {
    return (
      <PressableListItem
        key={"ProfileListItem#" + item.id}
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
      renderItem={renderItem}
      addPage={addPage}
      addText={addText}
    />
  );
};

export default ProfileList;
