import React from "react";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { View, Text, StyleSheet, ViewStyle, ScrollView } from "react-native";
import ExpandableList from "../ExpandableList";
import CategoryList from "./CategoryList";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ProfileList from "./ProfileList";
import PressableListItem from "../PressableListItem";
import { useNavigation } from "@react-navigation/native";
import * as DBController from "../../controllers/database/DatabaseController";

const CustomDrawerContent = (props: any) => {
  const insets = useSafeAreaInsets();
  const navigation: any = useNavigation();

  const containerStyle: ViewStyle = {
    flex: 1,
    paddingTop: insets.top + 4,
    paddingStart: insets.left,
  };

  return (
    <View style={[containerStyle, props.style]}>
      <ScrollView>
        <DrawerItemList {...props} />
        <View style={styles.expandableListWrapper}>
          <PressableListItem
            name={"Export Database"}
            selectThis={() => DBController.exportDatabase()}
            nameTextSize={15}
          />
        </View>
        <View style={styles.expandableListWrapper}>
          <ExpandableList
            innerComponent={<CategoryList />}
            title="Categories"
            open={false}
            containerStyle={styles.containerStyle}
            titleStyle={styles.titleStyle}
          />
        </View>
        <View style={styles.expandableListWrapper}>
          <ExpandableList
            innerComponent={<ProfileList />}
            title="Profiles"
            open={false}
            containerStyle={styles.containerStyle}
            titleStyle={styles.titleStyle}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  expandableListWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 11,
    paddingStart: 16,
    paddingEnd: 24,
  },
  containerStyle: {
    flex: 1,
    marginEnd: 12,
    marginVertical: 4,
    //overflow: "hidden"
  },
  titleStyle: {
    lineHeight: 24,
    textAlignVertical: "center",
  },
});

export default CustomDrawerContent;
