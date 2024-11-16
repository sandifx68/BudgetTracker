import React from "react";
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import { View, Text, StyleSheet, ViewStyle, ScrollView, TextStyle, Alert } from "react-native";
import ExpandableList from "../ExpandableList";
import CategoryList from "./CategoryList";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ProfileList from "./ProfileList";
import PressableListItem from "../PressableListItem";
import { useNavigation, useTheme } from "@react-navigation/native";
import * as DBController from "../../controllers/database/DatabaseController";
import Color from "color";

const renderOrder = [
  "Expense List",
  "Categories",
  "Profiles",
  "Export Database",
  "Import Database",
  "Reset Database",
];

interface IndexedDrawerItem {
  component: React.JSX.Element;
  index: number;
}

const CustomDrawerContent = (props: any) => {
  const insets = useSafeAreaInsets();
  const navigation: any = useNavigation();
  const { colors } = useTheme();
  const labelColor = Color(colors.text).alpha(0.68).rgb().string();
  const titleStyle: TextStyle = { ...styles.titleStyle, color: labelColor };

  const containerStyle: ViewStyle = {
    flex: 1,
    paddingTop: insets.top + 4,
    paddingStart: insets.left,
  };

  const handleResetDatabase = () => {
    Alert.alert(
      "Are you sure?",
      "Deleting the database is permanent and unrecoverable, unless you make a backup.",
      [
        {
          text: "Cancel",
        },
        {
          text: "Yes",
          onPress: () => DBController.replaceDatabase(),
        },
      ],
      { cancelable: false },
    );
  };

  const customElementRoots: React.JSX.Element[] = [
    <PressableListItem
      name={"Export Database"}
      selectThis={() => DBController.exportDatabase()}
      nameTextStyle={titleStyle}
    />,
    <PressableListItem
      name={"Reset Database"}
      selectThis={() => handleResetDatabase()}
      nameTextStyle={titleStyle}
    />,
    <ExpandableList innerComponent={<CategoryList />} title="Categories" open={false} />,
    <ExpandableList innerComponent={<ProfileList />} title="Profiles" open={false} />,
  ];

  const customElements: IndexedDrawerItem[] = customElementRoots.map((v) => {
    const index = renderOrder.indexOf(v.props.title ?? v.props.name);
    return {
      index: index,
      component: (
        <View key={`Drawer#${index}`} style={styles.expandableListWrapper}>
          {v}
        </View>
      ),
    };
  });

  const drawerElements: IndexedDrawerItem[] = props.state.routes
    .filter((item: any) => renderOrder.indexOf(props.descriptors[item.key]?.route.name) !== -1)
    .map((item: any) => {
      const isFocused = props.state.index === props.state.routes.indexOf(item);
      return {
        index: renderOrder.indexOf(props.descriptors[item.key]?.route.name),
        component: (
          <DrawerItem
            key={item.key}
            label={item.name}
            focused={isFocused}
            onPress={() => navigation.navigate(item.name)}
          />
        ),
      };
    });

  const sortedDrawerElements = [...customElements, ...drawerElements].sort(
    (a, b) => a.index - b.index,
  );

  return (
    <View style={[containerStyle, props.style]}>
      <ScrollView>{sortedDrawerElements.map((item) => item.component)}</ScrollView>
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
  titleStyle: {
    lineHeight: 24,
    fontWeight: "500",
    textAlignVertical: "center",
  },
});

export default CustomDrawerContent;
