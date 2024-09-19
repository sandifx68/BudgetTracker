import { useSQLiteContext } from "expo-sqlite";
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Svg, { Circle, Text as SvgText } from "react-native-svg";
import * as DBController from "../../DatabaseController";
import { createMonthYearPair } from "../../Utils";

interface Props {
  month: number;
  expenses: Expense[];
  width: number;
}

interface ChartEntry {
  categoryName: string;
  categorySum: number;
  color: string;
  angle: number;
  percent: number;
}

const ChartExpenses = ({ month, expenses, width }: Props): React.JSX.Element => {
  const [chartData, setChartData] = React.useState<ChartEntry[]>([]);
  const [focusedIndex, setFocusedIndex] = React.useState<number>();

  const db = useSQLiteContext();
  const strokeWidth = 50;
  const center = width / 2;
  const radius = (width - strokeWidth - 130) / 2;
  const circumference = 2 * Math.PI * radius;

  /**
   * Collect all the expenses based on their category name
   * @returns the categoty-expenses map
   */
  const collectExpensesPerCategory = (): Map<string, Expense[]> => {
    const expenseMap = new Map<string, Expense[]>();

    expenses.forEach((e) => {
      const category = e.category_name;
      if (!expenseMap.has(category)) {
        expenseMap.set(category, []);
      }
      expenseMap.get(category)!.push(e);
    });

    return expenseMap;
  };

  /**
   * Calculates the angles of the circle every time new data is loaded
   */
  const refresh = () => {
    const totalSum = expenses.reduce((sum, e) => sum + e.price, 0);
    const expenseMap = collectExpensesPerCategory();
    const generatedData: ChartEntry[] = [];
    let angle = 0;

    expenseMap.forEach((values, key) => {
      const categorySum = values.reduce((sum, e) => sum + e.price, 0);
      const percent = categorySum / totalSum;
      const color = DBController.getCategoryColor(db, key);

      generatedData.push({
        categoryName: key,
        categorySum: categorySum,
        angle: angle,
        color: color ?? "#808080",
        percent: percent,
      });
      angle += percent * 360;
    });

    setChartData(generatedData);
  };

  React.useEffect(() => {
    refresh();
  }, []);

  /**
   * (De)highlights the chart portion at position index
   * @param index the index of the chart position to be changed
   * @param highlighted whether it should be highlighted or not
   */
  const updateChartPortionColor = (index: number, highlighted: boolean) => {
    const newChartData = [...chartData];
    if (highlighted) {
      newChartData[index].color = "#ADD8E6";
      setFocusedIndex(index);
    } else {
      newChartData[index].color = DBController.getCategoryColor(
        db,
        newChartData[index].categoryName,
      );
      setFocusedIndex(undefined);
    }
    setChartData(newChartData);
  };

  return (
    <View style={{ width: width, height: width }}>
      <Svg viewBox={`0 0 ${width} ${width}`}>
        {chartData.map((item, index) => (
          <Circle
            onPressIn={() => updateChartPortionColor(index, true)}
            onPressOut={() => updateChartPortionColor(index, false)}
            key={"Circle#" + index}
            cy={center}
            cx={center}
            r={radius}
            strokeWidth={strokeWidth}
            stroke={item.color}
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - item.percent)}
            originX={center}
            originY={center}
            rotation={item.angle}
            fill="none"
          />
        ))}
        <SvgText stroke="purple" fontSize="12" x={width / 2} y={width / 2} textAnchor="middle">
          {focusedIndex !== undefined
            ? `${chartData[focusedIndex].categoryName} ${chartData[focusedIndex].categorySum}€`
            : `${createMonthYearPair(month).month} expenses`}
        </SvgText>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({});

export default ChartExpenses;
