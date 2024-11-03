import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

interface Props {
  name: string;
  selected?: boolean;
  selectThis: () => void;
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
        <Text style={styles.categoryText}>{props.name}</Text>
        <Pressable onPress={() => props.rightAction ? props.rightAction() : null}>
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
  categoryText: {
    fontSize: 24,
  },
  textWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
});

export default PressableListItem;
