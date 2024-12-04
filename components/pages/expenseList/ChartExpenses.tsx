import { useSQLiteContext } from "expo-sqlite";
import React from "react";
import { View, LayoutChangeEvent } from "react-native";
import Svg, { Circle, Text as SvgText, Line, SvgUri } from "react-native-svg";
import { getImageUris } from "../../../controllers/database/DatabaseController";
import {
  createDateFromIndex,
  createMonthYearKey,
} from "../../../controllers/expenseList/ExpenseListController";
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
  const [currency, setCurrency] = React.useState<string>("€");
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
    setCurrency(controller.currency);
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

  const renderCirclePortion = (item: ChartEntry, index: number) => {
    const commonProps = {
      cx: centerX,
      cy: layout.centerY,
      originX: centerX,
      originY: layout.centerY,
      rotation: item.angle,
      strokeDasharray: circumference,
      fill: "none",
    };
    return (
      <View key={"Circle#" + item.category.id + "Month#" + month}>
        {/* outer circle */}
        <Circle
          {...commonProps}
          strokeDashoffset={circumference * (1 - item.percent)}
          r={radius - 0.5} // Slightly smaller radius for the outline beginning
          strokeWidth={strokeWidth + 12} // Adjust width to make it visible
          stroke="black" // Outline color
        />
        {/* inner circle */}
        <Circle
          {...commonProps}
          strokeDashoffset={circumference * (1 - item.percent + 0.005)}
          onPressIn={() => updateChartPortionColor(index, true)}
          onPressOut={() => updateChartPortionColor(index, false)}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={item.color}
        />
      </View>
    );
  };

  const getFocusedChartText = (focusedChartPart: ChartEntry) => {
    return `${focusedChartPart.category.name} ${focusedChartPart.categorySum.toFixed(2)}${currency}`;
  };

  return (
    <View style={{ width: width }} onLayout={onLayout}>
      <Svg width={width} height={layout.height} viewBox={`0 0 ${width} ${layout.height}`}>
        {chartData.map((item, index) => renderCirclePortion(item, index))}
        <SvgText stroke="purple" fontSize="12" x={centerX} y={layout.centerY} textAnchor="middle">
          {focusedIndex !== undefined
            ? getFocusedChartText(chartData[focusedIndex])
            : `${createMonthYearKey(month).split(" ")[0]} expenses`}
        </SvgText>
        {categoryImagePositions.map((chartImage, index) => (
          <Line
            key={"Line#" + index + "Month#" + month}
            x1={chartImage.x1}
            y1={chartImage.y1}
            x2={chartImage.x2}
            y2={chartImage.y2}
            stroke={chartImage.color}
            strokeWidth={5}
          />
        ))}
      </Svg>
      {categoryImagePositions.map((chartImage, index) => (
        <View
          key={"ViewSvg#" + index + "Month#" + month}
          style={{
            position: "absolute",
            left: chartImage.posX,
            top: chartImage.posY,
          }}
        >
          <SvgUri
            uri={chartImage.svgUri}
            onPress={() =>
              navigation.navigate("Add Expense", {
                selectedCategoryId: chartData[index].category.id,
              })
            }
            onLongPress={() => updateChartPortionColor(index, true)}
            onPressOut={() => updateChartPortionColor(index, false)}
            width={svgDim}
            height={svgDim}
            fill={chartImage.color}
            stroke={"#000000"}
          />
        </View>
      ))}
    </View>
  );
};

export default ChartExpenses;
