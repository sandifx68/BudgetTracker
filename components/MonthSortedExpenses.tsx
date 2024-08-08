import { StyleSheet, Text, View, FlatList, Pressable, useWindowDimensions } from "react-native";
import DateSortedExpenses from "./DateSortedExpenses";
import React from "react";
import CategorySortedExpenses from "./CategorySortedExpenses";

interface Props {
  expenses: Expense[][];
  sortMethod: string;
  setPeriod: (period: string) => void;
}

const MonthSortedExpenses = ({ expenses, sortMethod, setPeriod }: Props) => {
  const { height, width } = useWindowDimensions();
  const EXPENSE_WIDTH = width - 50;

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  /**
   * Creates a key representing the month and year given the index.
   * @param index the index representing the distance in months from the current date.
   * @returns the date as a string (i.e. Aug 2023)
   */
  const createMonthKey = (index: number): string => {
    const currMonth = new Date().getMonth();
    const currYear = new Date().getFullYear();
    const month = (12 + ((currMonth - index) % 12)) % 12;
    const year = currYear - Math.floor((index - currMonth - 1) / 12 + 1);
    return months[month] + " " + year.toString();
  };

  const onViewableItemsChangedHandler = ({ viewableItems, changed }: any) => {
    if (viewableItems.length > 0) {
      const date = viewableItems[0].key;
      setPeriod(date);
    }
  };

  return (
    <FlatList
      data={expenses}
      renderItem={({ item, index }) => {
        if (sortMethod == "date")
          return <DateSortedExpenses expenses={item} width={EXPENSE_WIDTH} month={index} />;
        else if (sortMethod == "category")
          return <CategorySortedExpenses expenses={item} width={EXPENSE_WIDTH} month={index} />;
        else return null;
      }}
      keyExtractor={(item, index) => createMonthKey(index)}
      horizontal
      pagingEnabled
      inverted
      bounces={false}
      viewabilityConfig={{
        viewAreaCoveragePercentThreshold: 50,
      }}
      onViewableItemsChanged={onViewableItemsChangedHandler}
    />
  );
};

export default MonthSortedExpenses;
