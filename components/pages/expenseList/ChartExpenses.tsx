import exp from "constants";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface Props {
  month: number;
  expenses: Expense[];
  width: number;
}

interface ChartEntry {
  color: string;
  angle: number;
  percent: number;
}

const ChartExpenses = ({ month, expenses, width }: Props): React.JSX.Element => {
  const strokeWidth = 20;

  const [chartData, setChartData] = React.useState<ChartEntry[]>([]);
  const center = width / 2;
  const radius = (width - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

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

  const refresh = () => {
    const totalSum = expenses.reduce((sum, e) => sum + e.price, 0);
    const expenseMap = collectExpensesPerCategory();
    const generatedData: ChartEntry[] = [];
    let angle = 0;

    expenseMap.forEach((values, key) => {
      const categorySum = values.reduce((sum, e) => sum + e.price, 0);
      const percent = categorySum / totalSum;
      let color;
      if (key === "food") color = "#ff0000";
      else color = "#008000";

      generatedData.push({
        angle: angle,
        color: color,
        percent: percent,
      });
      angle += percent * 360;
    });

    setChartData(generatedData);
  };

  React.useEffect(() => {
    refresh();
  }, []);

  return (
    <View style={{ width: width, height: width }}>
      <Svg viewBox={`0 0 ${width} ${width}`}>
        {chartData.map((item, index) => (
          <Circle
            key={index}
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
          />
        ))}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({});

export default ChartExpenses;
