import { FlatList, Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import DateSortedExpenses from "./DateSortedExpenses";
import React from "react";
import CategorySortedExpenses from "./CategorySortedExpenses";
import ChartExpenses from "./ChartExpenses";
import {
  createDateFromIndex,
  createMonthYearKey,
} from "../../../controllers/expenseList/ExpenseListController";
import * as DBO from "../../../controllers/database/DatabaseOperationsController";
import { useSQLiteContext } from "expo-sqlite";
import { useFocusEffect, useTheme } from "@react-navigation/native";

interface Props {
  profile: Profile | undefined;
}

const MonthSortedExpenses = ({ profile }: Props) => {
  const { height, width } = useWindowDimensions();
  const EXPENSE_WIDTH = width - 50;
  const [categoryMap, setCategoryMap] = React.useState<Map<number, string>>();
  const sortMethods = ["date", "category", "chart"];
  const [sortMethod, setSortMethod] = React.useState<string>(sortMethods[0]);
  const db = useSQLiteContext();
  const { colors } = useTheme();
  const componentsMap: Record<string, (props: any) => React.JSX.Element> = {
    date: DateSortedExpenses,
    category: CategorySortedExpenses,
    chart: ChartExpenses,
  };

  const toggleSortMethod = () => {
    const methodIndex = sortMethods.findIndex((v) => v === sortMethod);
    setSortMethod(sortMethods[(methodIndex + 1) % sortMethods.length]);
  };

  // When we load the app
  React.useEffect(() => {
    setCategoryMap(DBO.getCategoryMap(db));
  }, []);

  //Everytime we come into focus
  useFocusEffect(
    React.useCallback(() => {
      setCategoryMap(DBO.getCategoryMap(db));
    }, []),
  );

  const renderItem = ({ item }: { item: number }): React.JSX.Element | null => {
    if (profile && categoryMap) {
      const ExpenseSortMethod = componentsMap[sortMethod];
      const date = createDateFromIndex(item);
      const expenses = DBO.getExpensesPerMonth(db, date, profile, categoryMap);
      return (
        <View>
          <View style={styles.dateAndSortContainer}>
            <Text style={[styles.monthStyle, { color: colors.text }]}>
              Expenses for {createMonthYearKey(item)}
            </Text>
            <Pressable
              style={[
                styles.sortWrapper,
                { borderColor: colors.border, backgroundColor: colors.card },
              ]}
              onPress={() => toggleSortMethod()}
            >
              <Text style={{ color: colors.text }}> Sort </Text>
            </Pressable>
          </View>

          <View
            style={[
              styles.expenseSortMethodWrapper,
              { borderColor: colors.border, backgroundColor: colors.background },
            ]}
          >
            <ExpenseSortMethod expenses={expenses} width={EXPENSE_WIDTH} month={item} />
          </View>
          <View style={styles.spentContainer}>
            <Text style={[styles.spent, { color: colors.text, borderColor: colors.border }]}>
              Spent: {DBO.getExpenseSumPerMonth(db, date, profile?.id ?? 0)} €
            </Text>
          </View>
        </View>
      );
    }
    return null;
  };

  return (
    <FlatList
      data={[...Array(60).keys()]}
      renderItem={renderItem}
      keyExtractor={(item) => createMonthYearKey(item)}
      horizontal
      pagingEnabled
      inverted
      initialNumToRender={1}
      windowSize={10}
      bounces={false}
    />
  );
};

const styles = StyleSheet.create({
  sortWrapper: {
    borderColor: "gray",
    borderWidth: 3,
    borderRadius: 10,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  dateAndSortContainer: {
    marginVertical: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  monthStyle: {
    marginBottom: 10,
  },
  expenseSortMethodWrapper: {
    borderWidth: 5,
    borderRadius: 10,
    flex: 1,
  },
  spentContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  spent: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    borderColor: "gray",
    borderWidth: 3,
    borderRadius: 10,
    width: 200,
  },
});

export default MonthSortedExpenses;
