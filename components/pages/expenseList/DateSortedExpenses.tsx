import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, FlatList } from "react-native";
import ExpandableList from "../../ExpandableList";
import ExpenseComponent from "./ExpenseComponent";
import EmptyExpenseList from "./EmptyExpenseList";

interface Props {
  month: number;
  expenses: Expense[];
  width: number;
}

const DateSortedExpenses = ({ month, expenses, width }: Props) => {
  /**
   * Gives st, th or nd based on the date
   * @param day the day
   * @returns st, th or nd based on the date
   */
  const nth = (day: number) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  /**
   * Render expenses of a certain day in an expandable list
   * @param expenses expenses in a day
   * @param day the day of the expenses
   * @returns ExpandableList with the expenses of that day
   */
  const renderExpensesDay = (expenses: Expense[], day: number) => {
    if (expenses.length == 0) return null;

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
        title={day + nth(day) + " of the month"}
        width={width}
        totalPrice={expenses.reduce((partialSum, e) => partialSum + e.price, 0)}
      />
    );
  };

  /**
   * Given a list of expenses, separate them in a 2d array, the first dimension
   * representing the day of the expense
   * @param expenses the expenses to be separated
   * @returns 2d array of expenses, with the first dimension being the day of the expense
   */
  const collectExpensesPerDay = (expenses: Expense[]): Expense[][] => {
    let days: Expense[][] = [...Array(32).keys()].map((i) => []);
    for (const e of expenses) {
      const expenseDay = new Date(e.date).getDate();
      days[expenseDay].push(e);
    }
    return days;
  };

  if (expenses.length == 0) return <EmptyExpenseList width={width} />;

  return (
    <FlatList
      data={collectExpensesPerDay(expenses)}
      renderItem={({ item, index }) => renderExpensesDay(item, index)}
      keyExtractor={(item, index) => `Month ${month} day ${index}`}
      initialNumToRender={50}
    />
  );
};

export default DateSortedExpenses;
