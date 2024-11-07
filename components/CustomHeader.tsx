import React from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";

interface Props {
  title: string;
  navigation: any;
  rightComponent?: React.JSX.Element;
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
    backgroundColor: "#E8EAED",
    paddingTop: 60,
    paddingHorizontal: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 10,
    borderRadius: 10,
    alignItems: "center",
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
