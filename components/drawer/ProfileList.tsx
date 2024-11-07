import React from "react";
import * as DBOController from "../../controllers/database/DatabaseOperationsController";
import { useNavigation } from "@react-navigation/native";
import DrawerItemList from "./DrawerItemList";
import PressableListItem from "../PressableListItem";

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
