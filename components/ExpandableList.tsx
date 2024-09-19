import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, LayoutChangeEvent } from "react-native";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";

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
  const [expanded, setExpanded] = useState<boolean>(props.open != undefined ? props.open : false);
  const [height, setHeight] = useState(0);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const onLayout = (event: LayoutChangeEvent) => {
    const onLayoutHeight = event.nativeEvent.layout.height;

    if (onLayoutHeight > 0 && height !== onLayoutHeight) {
      setHeight(onLayoutHeight);
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    const animatedHeight = expanded ? withTiming(height) : withTiming(0);
    return {
      height: animatedHeight,
    };
  });

  return (
    <View style={{ ...(props.containerStyle ?? styles.itemContainer), width: props.width }}>
      <Pressable onPress={toggleExpand}>
        <View style={styles.titlePriceContainer}>
          <Text style={props.titleStyle ?? styles.itemTitle}>{props.title}</Text>

          <Text style={styles.price}> {props.totalPrice?.toFixed(2)} </Text>
        </View>
      </Pressable>
      <Animated.View style={[animatedStyle, { overflow: "hidden" }]}>
        <View style={{ position: "absolute" }} onLayout={onLayout}>
          {props.innerComponent}
        </View>
      </Animated.View>
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
