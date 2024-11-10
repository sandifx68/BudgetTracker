import React from "react";
import { View, Text, StyleSheet, Pressable, TextStyle } from "react-native";

interface Props {
  name: string;
  nameTextStyle?: TextStyle;
  selectThis: () => void;
  selected?: boolean;
  rightAction?: () => void;
  rightText?: string;
}

const PressableListItem = (props: Props) => {
  return (
    <Pressable
      style={[styles.container, props.selected ? styles.selected : {}]}
      onPress={() => props.selectThis()}
    >
      <View style={styles.textWrapper}>
        <Text style={[props.nameTextStyle ?? styles.defaultNameTextStyle]}>{props.name}</Text>
        <Pressable onPress={() => (props.rightAction ? props.rightAction() : null)}>
          <Text>{props.rightText}</Text>
        </Pressable>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    borderRadius: 10,
  },
  selected: {
    backgroundColor: "#FA7B5F",
  },
  textWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  defaultNameTextStyle: {
    fontSize: 24,
  },
});

export default PressableListItem;
