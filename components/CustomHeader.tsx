import { useTheme } from "@react-navigation/native";
import React from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
  title: string;
  navigation: any;
  rightComponent?: React.JSX.Element;
}

const CustomHeader = (props: Props) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.headerContainer,
        { backgroundColor: colors.card, paddingTop: Math.max(12, insets.top + 8) },
      ]}
    >
      <View style={styles.headerLeftContainer}>
        <Pressable onPress={() => props.navigation.openDrawer()}>
          <Text
            style={[
              styles.hamburgerMenu,
              { color: colors.text, backgroundColor: colors.background },
            ]}
          >
            {" "}
            ≡{" "}
          </Text>
        </Pressable>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{props.title}</Text>
      </View>

      {props.rightComponent}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
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
