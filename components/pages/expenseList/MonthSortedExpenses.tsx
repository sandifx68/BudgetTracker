import { FlatList, useWindowDimensions } from "react-native";
import DateSortedExpenses from "./DateSortedExpenses";
import React from "react";
import CategorySortedExpenses from "./CategorySortedExpenses";
import ChartExpenses from "./ChartExpenses";
import {
  calculateMonthlySpent,
  createMonthYearPair,
} from "../../../controllers/expenseList/ExpenseListController";

interface Props {
  expenses: Expense[][];
  sortMethod: string;
  setPeriod: (period: string) => void;
  setMonthlySpent: (spent: number) => void;
}

const MonthSortedExpenses = ({ expenses, sortMethod, setPeriod, setMonthlySpent }: Props) => {
  const { height, width } = useWindowDimensions();
  const EXPENSE_WIDTH = width - 50;
  const [currentDate, setCurrentDate] = React.useState<string>();

  const onViewableItemsChangedHandler = ({ viewableItems, changed }: any) => {
    if (viewableItems.length > 0) {
      const date = viewableItems[0].key;
      setCurrentDate(date);
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

  // Every time expenses are refreshed, we want to update monthly spent
  React.useEffect(() => {
    if (currentDate) setMonthlySpent(calculateMonthlySpent(expenses, currentDate));
  }, [expenses]);

  return (
    <FlatList
      data={expenses}
      renderItem={({ item, index }) => {
        const Component = componentsMap[sortMethod];
        return Component ? <Component expenses={item} width={EXPENSE_WIDTH} month={index} /> : null;
      }}
      keyExtractor={(item, index) =>
        `${createMonthYearPair(index).month} ${createMonthYearPair(index).year}`
      }
      horizontal
      pagingEnabled
      inverted
      initialNumToRender={5}
      maxToRenderPerBatch={5}
      windowSize={5}
      bounces={false}
      viewabilityConfig={{
        viewAreaCoveragePercentThreshold: 50,
      }}
      onViewableItemsChanged={onViewableItemsChangedHandler}
    />
  );
};

export default MonthSortedExpenses;
