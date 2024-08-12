import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

const EmptyExpenseList = ({ width }: any) => {
  return (
    <View style={{ width: width, ...styles.emptyExpenseListContainer }}>
      <Text> There are no records for this period. </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyExpenseListContainer: {
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  },
});

export default EmptyExpenseList;
