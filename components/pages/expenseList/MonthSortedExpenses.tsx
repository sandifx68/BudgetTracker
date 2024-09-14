import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  useWindowDimensions,
  ViewToken,
} from "react-native";
import DateSortedExpenses from "./DateSortedExpenses";
import React, { ComponentType } from "react";
import CategorySortedExpenses from "./CategorySortedExpenses";
import ChartExpenses from "./ChartExpenses";

interface Props {
  expenses: Expense[][];
  sortMethod: string;
  setPeriod: (period: string) => void;
  setMonthlySpent: (spent: number) => void;
}

const MonthSortedExpenses = ({ expenses, sortMethod, setPeriod, setMonthlySpent }: Props) => {
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
      setMonthlySpent(
        viewableItems[0].item.reduce((partialSum: number, i: Expense) => partialSum + i.price, 0),
      );
    }
  };

  const componentsMap: Record<string, (props: any) => React.JSX.Element> = {
    date: DateSortedExpenses,
    category: CategorySortedExpenses,
    chart: ChartExpenses,
  };

  return (
    <FlatList
      data={expenses}
      renderItem={({ item, index }) => {
        const Component = componentsMap[sortMethod];
        return Component ? <Component expenses={item} width={EXPENSE_WIDTH} month={index} /> : null;
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
