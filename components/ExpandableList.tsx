import { useTheme } from "@react-navigation/native";
import Color from "color";
import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, LayoutChangeEvent, TextStyle } from "react-native";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";

interface Props {
  title: string;
  innerComponent: React.JSX.Element;
  open?: boolean;
}

const ExpandableList = (props: Props) => {
  const [expanded, setExpanded] = useState<boolean>(props.open ?? false);
  const [height, setHeight] = useState(0);
  const { colors } = useTheme();
  const labelColor = Color(colors.text).alpha(0.68).rgb().string();

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
    <View style={styles.containerStyle}>
      <Pressable onPress={toggleExpand}>
        <View style={styles.titlePriceContainer}>
          <Text style={[styles.titleStyle, { color: labelColor }]}>{props.title}</Text>
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
  containerStyle: {
    flex: 1,
    marginEnd: 12,
    marginVertical: 4,
  },
  titleStyle: {
    lineHeight: 24,
    fontWeight: "500",
    textAlignVertical: "center",
  },
  titlePriceContainer: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
  },
});

export default ExpandableList;
