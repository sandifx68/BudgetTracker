import React from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";

interface Props {
  title: string;
  rightComponent?: React.JSX.Element;
  navigation: any;
}

const CustomHeader = (props: Props) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerLeftContainer}>
        <Pressable onPress={() => props.navigation.openDrawer()}>
          <Text style={styles.hamburgerMenu}> ≡ </Text>
        </Pressable>
        <Text style={styles.sectionTitle}>{props.title}</Text>
      </View>

      {props.rightComponent}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  headerLeftContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  hamburgerMenu: {
    fontSize: 30,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "white",
    borderRadius: 10,
  },
});

export default CustomHeader;
