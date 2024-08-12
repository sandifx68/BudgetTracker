import React from "react";
import { FlatList } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import ExpenseComponent from "./ExpenseComponent";
import ExpandableList from "../../ExpandableList";
import EmptyExpenseList from "./EmptyExpenseList";

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

  const renderExpensesCategory = (expenses: Expense[], categoryIndex: number) => {
    if (expenses.length == 0) return null;

    //Maybe extract to another component?
    let innerComponent = (
      <FlatList
        data={expenses}
        renderItem={({ item }) => <ExpenseComponent expense={item} width={width} />}
        keyExtractor={(item) => "Expense" + item.id.toString()}
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />
    );

    return (
      <ExpandableList
        innerComponent={innerComponent}
        title={categories[categoryIndex]}
        width={width}
        totalPrice={expenses.reduce((partialSum, e) => partialSum + e.price, 0)}
      />
    );
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

  if (expenses.length == 0) return <EmptyExpenseList width={width} />;

  return (
    <FlatList
      data={collectExpensesPerCategory(expenses)}
      renderItem={({ item, index }) => renderExpensesCategory(item, index)}
      keyExtractor={(item, index) => `Month ${month} day ${index}`}
      initialNumToRender={50}
    />
  );
};

export default CategorySortedExpenses;
