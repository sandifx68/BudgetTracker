import React from "react";
import { FlatList, Text, StyleSheet, View, Pressable } from "react-native";
import * as SQLite from "expo-sqlite";
import { useNavigation } from "@react-navigation/native";
import { useDrawerStatus } from "@react-navigation/drawer";

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
          <View style={styles.buttonWrapper}>
            <Text style={styles.addText}> {props.addText} </Text>
            <Text style={styles.addText}> + </Text>
          </View>
        </Pressable>
      </View>

      <View style={styles.categoriesWrapper}>{items.map((item) => props.renderItem(item))}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    //minHeight: 0,
    display: "flex",
    //justifyContent: "space-between",
    backgroundColor: "#E8EAED",
    alignItems: "flex-start",
  },
  buttonWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "gainsboro",
    width: "100%",
    paddingLeft: 10,
  },
  categoriesWrapper: {
    width: "100%",
    paddingHorizontal: 15,
    backgroundColor: "gray",
    borderColor: "#C0C0C0",
    borderWidth: 1,
  },
  addText: {
    fontSize: 24,
  },
});

export default DrawerItemList;
