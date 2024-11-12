import { FlatList, useWindowDimensions } from "react-native";
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
import { useFocusEffect, useNavigation } from "@react-navigation/native";

interface Props {
  profile: Profile | undefined;
  sortMethod: string;
  setMonthIndex: (period: number) => void;
}

const MonthSortedExpenses = ({ profile, sortMethod, setMonthIndex }: Props) => {
  const { height, width } = useWindowDimensions();
  const EXPENSE_WIDTH = width - 50;
  const [categoryMap, setCategoryMap] = React.useState<Map<number, string>>();
  const [refreshKey, setRefreshKey] = React.useState(0);
  const db = useSQLiteContext();
  const componentsMap: Record<string, (props: any) => React.JSX.Element> = {
    date: DateSortedExpenses,
    category: CategorySortedExpenses,
    chart: ChartExpenses,
  };

  // When we load the app
  React.useEffect(() => {
    setCategoryMap(DBO.getCategoryMap(db));
  }, []);

  //Everytime we come into focus
  useFocusEffect(
    React.useCallback(() => {
      setCategoryMap(DBO.getCategoryMap(db));
      setRefreshKey((prevKey) => prevKey + 1); // Update key to force FlatList rerender
    }, []),
  );

  const onViewableItemsChangedHandler = ({ viewableItems, changed }: any) => {
    if (viewableItems.length > 0) setMonthIndex(viewableItems[0].index);
  };

  const renderItem = ({ item }: { item: number }): React.JSX.Element | null => {
    if (profile && categoryMap) {
      const ExpenseSortMethod = componentsMap[sortMethod];
      const date = createDateFromIndex(item);
      const expenses = DBO.getExpensesPerMonth(db, date, profile, categoryMap);
      return <ExpenseSortMethod expenses={expenses} width={EXPENSE_WIDTH} month={item} />;
    }
    return null;
  };

  return (
    <FlatList
      data={[...Array(60).keys()]}
      renderItem={renderItem}
      keyExtractor={(item) => createMonthYearKey(item)}
      extraData={refreshKey}
      horizontal
      pagingEnabled
      inverted
      initialNumToRender={1}
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
