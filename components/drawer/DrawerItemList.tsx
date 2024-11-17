import React from "react";
import { FlatList, Text, StyleSheet, View, Pressable } from "react-native";
import * as SQLite from "expo-sqlite";
import { useNavigation, useTheme } from "@react-navigation/native";
import { useDrawerStatus } from "@react-navigation/drawer";
import Color from "color";

interface Props {
  itemGetter: (db: any) => any[];
  addPage: string;
  addText: string;
  renderItem: (item: any) => React.JSX.Element | null;
}

const DrawerItemList = (props: Props) => {
  const db = SQLite.useSQLiteContext();
  const [items, setItems] = React.useState<Category[]>([]);
  const navigation: any = useNavigation();
  const { colors } = useTheme();
  const addColor = Color(colors.background).alpha(0.4).rgb().string();

  const isDrawerOpen = useDrawerStatus() === "open";

  const fetchData = async () => {
    const items = await props.itemGetter(db);
    setItems(items);
  };

  // Every time we open the drawer we want to refresh
  React.useEffect(() => {
    if (isDrawerOpen) fetchData();
  }, [isDrawerOpen]);

  return (
    <View style={styles.container}>
      <View>
        <Pressable onPress={() => navigation.navigate(props.addPage)}>
          <View style={[styles.buttonWrapper, { backgroundColor: colors.background }]}>
            <Text style={[styles.addTextLeft, { color: colors.text }]}> {props.addText} </Text>
            <Text style={[styles.addTextRight, { color: colors.text, borderColor: colors.border }]}>
              {" "}
              +{" "}
            </Text>
          </View>
        </Pressable>
      </View>

      <View
        style={[
          styles.categoriesWrapper,
          { backgroundColor: addColor, borderColor: colors.border },
        ]}
      >
        {items.map((item) => props.renderItem(item))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "flex-start",
  },
  buttonWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingLeft: 10,
  },
  categoriesWrapper: {
    width: "100%",
    paddingLeft: 15,
    paddingRight: 5,
    borderWidth: 1,
  },
  addTextLeft: {
    fontSize: 24,
  },
  addTextRight: {
    fontSize: 24,
    // borderWidth: 2,
    textAlign: "center",
  },
});

export default DrawerItemList;
