import React from "react";
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from "@react-navigation/drawer";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import ExpandableList from "./ExpandableList";
import CategoryList from "./pages/categoryList/CategoryList";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CustomDrawerContent = (props: any) => {
  const insets = useSafeAreaInsets();

  const containerStyle: ViewStyle = {
    flex: 1,
    paddingTop: insets.top + 4,
    paddingStart: insets.left,
  };

  return (
    <View style={[containerStyle, props.style]}>
      <DrawerItemList {...props} />
      <View style={styles.expandableListWrapper}>
        <ExpandableList
          innerComponent={<CategoryList navigation={props.navigation} />}
          title="Categories"
          open={false}
          containerStyle={styles.containerStyle}
          titleStyle={styles.titleStyle}
        />
      </View>
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
