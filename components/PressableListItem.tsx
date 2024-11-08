import React from "react";
import { View, Text, StyleSheet, Pressable, ViewStyle, TextStyle } from "react-native";

interface Props {
  name: string;
  nameTextSize?: number;
  selectThis: () => void;
  selected?: boolean;
  rightAction?: () => void;
  rightText?: string;
}

const PressableListItem = (props: Props) => {
  let textStyle: TextStyle = {};
  if (props.nameTextSize)
    textStyle = {
      lineHeight: props.nameTextSize,
    };
  else
    textStyle = {
      fontSize: 24,
    };

  return (
    <Pressable
      style={[styles.container, props.selected ? styles.selected : {}]}
      onPress={() => props.selectThis()}
    >
      <View style={styles.textWrapper}>
        <Text style={textStyle}>{props.name}</Text>
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
});

export default PressableListItem;
