import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

interface Props {
  title: string;
  innerComponent: React.JSX.Element;
  width?: number;
  totalPrice?: number;
  open?: boolean;
  containerStyle?: any;
  titleStyle?: any;
}

const ExpandableList = (props: Props) => {
  const [expanded, setExpanded] = useState<boolean>(props.open != undefined ? props.open : true);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <View style={{ ...(props.containerStyle ?? styles.itemContainer), width: props.width }}>
      <Pressable onPress={toggleExpand}>
        <View style={styles.titlePriceContainer}>
          <Text style={props.titleStyle ?? styles.itemTitle}>{props.title}</Text>

          <Text style={styles.price}> {props.totalPrice?.toFixed(2)} </Text>
        </View>
      </Pressable>
      {expanded && props.innerComponent}
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: "gainsboro",
    borderRadius: 10,
    marginBottom: 10,
    paddingBottom: 20,
    overflow: "hidden",
  },
  itemTitle: {
    marginLeft: 5,
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  itemContent: {
    marginTop: 10,
    fontSize: 14,
    color: "#666",
  },
  titlePriceContainer: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  price: {
    marginRight: 10,
  },
});

export default ExpandableList;
