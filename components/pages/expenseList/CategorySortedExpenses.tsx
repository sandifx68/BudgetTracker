import React, { useCallback } from "react";
import { FlatList } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import EmptyExpenseList from "./EmptyExpenseList";
import ExpandableExpenseList from "../../ExpandableExpenseList";

interface Props {
  month: number;
  expenses: Expense[];
  width: number;
}

const CategorySortedExpenses = ({ month, expenses, width }: Props) => {
  const db = useSQLiteContext();
  const categories: string[] = db
    .getAllSync<Category>("SELECT * FROM categories")
    .map((e) => e.name);

  const constructCategoryMap = (categories: string[]) => {
    const map = new Map<string, number>();
    for (let i = 0; i < categories.length; i++) map.set(categories[i], i);
    return map;
  };

  const collectExpensesPerCategory = (expenses: Expense[]): Expense[][] => {
    const categoryMap: Map<string, number> = constructCategoryMap(categories);
    const collectedExpenses: Expense[][] = [...Array(categories.length).keys()].map((i) => []);

    for (let e of expenses) {
      const index = categoryMap.get(e.category_name) || 0;
      collectedExpenses[index].push(e);
    }

    return collectedExpenses;
  };

  const renderExpensesCategory = useCallback(
    ({ item, index }: { item: Expense[]; index: number }) => {
      if (item.length == 0) return null;

      return (
        <ExpandableExpenseList
          expenses={item}
          title={categories[index]}
          width={width}
          totalPrice={expenses.reduce((partialSum, e) => partialSum + e.price, 0)}
        />
      );
    },
    [],
  );

  if (expenses.length == 0) return <EmptyExpenseList width={width} />;

  return (
    <FlatList
      data={collectExpensesPerCategory(expenses)}
      removeClippedSubviews={true}
      windowSize={5}
      renderItem={renderExpensesCategory}
      keyExtractor={(item, index) => `Month ${month} day ${index}`}
      initialNumToRender={50}
    />
  );
};

export default CategorySortedExpenses;
