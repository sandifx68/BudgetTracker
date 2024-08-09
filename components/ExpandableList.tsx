import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

interface Props {
  title: string;
  innerComponent: React.JSX.Element;
  width: number;
  totalPrice: number;
}

const ExpandableList = ({ title, innerComponent, width, totalPrice }: Props) => {
  const [expanded, setExpanded] = useState(true);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <View style={{ ...styles.itemContainer, width: width }}>
      <Pressable onPress={toggleExpand} style={{ ...styles.itemTouchable, width: width }}>
        <View style={styles.titlePriceContainer}>
          <Text style={styles.itemTitle}>{title}</Text>

          <Text style={styles.price}> {totalPrice.toFixed(2)} </Text>
        </View>
      </Pressable>
      {expanded && innerComponent}
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: "gainsboro",
    borderRadius: 10,
    marginBottom: 10,
  },
  itemTouchable: {
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 10,
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
