import { useSQLiteContext } from "expo-sqlite";
import React from "react";
import { View, LayoutChangeEvent } from "react-native";
import Svg, { Circle, Text as SvgText, Line, SvgUri } from "react-native-svg";
import { getImageUris } from "../../../controllers/database/DatabaseController";
import { createMonthYearPair } from "../../../controllers/expenseList/ExpenseListController";
import {
  CategoryImage,
  ChartEntry,
  ChartExpensesController,
} from "../../../controllers/expenseList/ChartExpensesController";
import { useNavigation } from "@react-navigation/native";

interface Props {
  month: number;
  expenses: Expense[];
  width: number;
}

const ChartExpenses = ({ month, expenses, width }: Props): React.JSX.Element => {
  const [chartData, setChartData] = React.useState<ChartEntry[]>([]);
  const [categoryImagePositions, setCategoryImagePositions] = React.useState<CategoryImage[]>([]);
  const [focusedIndex, setFocusedIndex] = React.useState<number>();
  const [layout, setLayout] = React.useState({ height: 472.0, centerY: 472.0 / 2.0 });
  const navigation: any = useNavigation();

  const db = useSQLiteContext();
  const strokeWidth = 35;
  const centerX = width / 2;
  const radius = (width - strokeWidth - 160) / 2;
  const circumference = 2 * Math.PI * radius;
  const svgDim = 60;

  const refresh = async () => {
    const imageUris = await getImageUris();
    const controller = new ChartExpensesController(
      expenses,
      db,
      width,
      layout.height,
      svgDim,
      radius,
      imageUris,
    );
    setChartData(controller.chartData);
    setCategoryImagePositions(controller.imagePositions);
  };

  React.useEffect(() => {
    navigation.addListener("focus", () => {
      refresh();
    });
    refresh();
  }, [navigation]);

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
      newChartData[index].color = newChartData[index].category.color;
      setFocusedIndex(undefined);
    }
    setChartData(newChartData);
  };

  /**
   * Function to update the height of the chart area dynamically.
   * @param event a layout event
   */
  const onLayout = (event: LayoutChangeEvent) => {
    const onLayoutHeight = event.nativeEvent.layout.height;

    if (onLayoutHeight > 0 && layout.height !== onLayoutHeight) {
      setLayout({ height: onLayoutHeight, centerY: onLayoutHeight / 2 });
    }
  };

  return (
    <View style={{ flex: 1 }} onLayout={onLayout}>
      <Svg width={width} height={layout.height} viewBox={`0 0 ${width} ${layout.height}`}>
        {chartData.map((item, index) => (
          <Circle
            onPressIn={() => updateChartPortionColor(index, true)}
            onPressOut={() => updateChartPortionColor(index, false)}
            key={"Circle#" + index}
            cx={centerX}
            cy={layout.centerY}
            r={radius}
            strokeWidth={strokeWidth}
            stroke={item.color}
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - item.percent)}
            originX={centerX}
            originY={layout.centerY}
            rotation={item.angle}
            fill="none"
          />
        ))}
        <SvgText stroke="purple" fontSize="12" x={centerX} y={layout.centerY} textAnchor="middle">
          {focusedIndex !== undefined
            ? `${chartData[focusedIndex].category.name} ${chartData[focusedIndex].categorySum}€`
            : `${createMonthYearPair(month).month} expenses`}
        </SvgText>
        {categoryImagePositions.map((chartImage, index) => (
          <Line
            key={"Line#" + index}
            x1={chartImage.x1}
            y1={chartImage.y1}
            x2={chartImage.x2}
            y2={chartImage.y2}
            stroke={chartImage.color}
            strokeWidth={5}
          />
        ))}
      </Svg>
      {categoryImagePositions.map((chartImage, index) => {
        return (
          <View
            key={"Svg#" + index}
            style={{
              position: "absolute",
              left: chartImage.posX,
              top: chartImage.posY,
            }}
          >
            <SvgUri
              uri={chartImage.svgUri}
              width={svgDim}
              height={svgDim}
              fill={chartImage.color}
              stroke={"#000000"}
            />
          </View>
        );
      })}
    </View>
  );
};

export default ChartExpenses;
