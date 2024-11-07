import { useSQLiteContext } from "expo-sqlite";
import React from "react";
import { View, LayoutChangeEvent } from "react-native";
import Svg, { Circle, Text as SvgText, Line } from "react-native-svg";
import * as DBOController from "../../../controllers/database/DatabaseOperationsController";
import { createMonthYearPair } from "../../../controllers/expenseList/ExpenseListController";
import { imageData } from "../../../assets/categoryImages/imageData";
import {
  collectExpensesPerCategory,
  projectToBorder,
} from "../../../controllers/expenseList/ChartExpensesController";

interface Props {
  month: number;
  expenses: Expense[];
  width: number;
}

interface ChartEntry {
  category: Category;
  categorySum: number;
  color: string;
  angle: number;
  percent: number;
}

interface CategoryImage {
  svg: any;
  color: string;
  posX: number;
  posY: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const ChartExpenses = ({ month, expenses, width }: Props): React.JSX.Element => {
  const [chartData, setChartData] = React.useState<ChartEntry[]>([]);
  const [categoryImagePositions, setCategoryImagePositions] = React.useState<CategoryImage[]>([]);
  const [focusedIndex, setFocusedIndex] = React.useState<number>();
  const [layout, setLayout] = React.useState({ height: 472.0, centerY: 472.0 / 2.0 });

  const db = useSQLiteContext();
  const strokeWidth = 35;
  const centerX = width / 2;
  const radius = (width - strokeWidth - 160) / 2;
  const circumference = 2 * Math.PI * radius;
  const svgDim = 60;

  /**
   * Function to generate the data necessary to display the expense chart.
   * @returns the data to generate the pie chart.
   */
  const generateCharData = (): ChartEntry[] => {
    const totalSum = expenses.reduce((sum, e) => sum + e.price, 0);
    const expenseMap = collectExpensesPerCategory(expenses);
    const generatedData: ChartEntry[] = [];
    let angle = 0;

    expenseMap.forEach((values, key) => {
      const categorySum = values.reduce((sum, e) => sum + e.price, 0);
      const percent = categorySum / totalSum;
      const color = DBOController.getCategory(db, key).color;

      generatedData.push({
        category: DBOController.getCategory(db, key),
        categorySum: categorySum,
        angle: angle,
        color: color ?? "#808080",
        percent: percent,
      });
      angle += percent * 360;
    });

    return generatedData;
  };

  /**
   * Goes through the chart data to generate the category image positions.
   * The postion of the middle of the arc is also provided so the line can
   * be drawn from the image to the chart.
   */
  const calculateCategoryImagePositions = (chartData: ChartEntry[]): CategoryImage[] => {
    const generatedImagePositions: CategoryImage[] = [];

    chartData.forEach((chartArc, index) => {
      if (chartArc.categorySum == 0) return;
      const imageId = chartArc.category.image_id;
      if (imageId === null) {
        console.log("This category has no imageId attached", chartArc.category);
        return;
      }
      const imageSource = imageData[imageId].source;
      const angleUntil = index == chartData.length - 1 ? 360.0 : chartData[index + 1].angle;
      const mdlAngle = (chartArc.angle + angleUntil) / 2;
      const angleRadians = (mdlAngle * Math.PI) / 180.0; // - bcs we want counter clockwise
      const mdlArcX = centerX + (radius + 30) * Math.cos(angleRadians);
      const mdlArcY = layout.centerY + (radius + 30) * Math.sin(angleRadians);
      const imgPos = projectToBorder(mdlArcX, mdlArcY, mdlAngle, width, layout.height, svgDim);
      generatedImagePositions.push({
        svg: imageSource,
        x1: mdlArcX,
        y1: mdlArcY,
        x2: imgPos[2],
        y2: imgPos[3],
        posX: imgPos[0],
        posY: imgPos[1],
        color: chartArc.category.color,
      });
    });
    return generatedImagePositions;
  };

  React.useEffect(() => {
    const refresh = () => {
      const chartData = generateCharData();
      const categoryImagePositions = calculateCategoryImagePositions(chartData);
      setChartData(chartData);
      setCategoryImagePositions(categoryImagePositions);
    };

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
            <chartImage.svg
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
