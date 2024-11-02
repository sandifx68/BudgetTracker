import { useSQLiteContext } from "expo-sqlite";
import React from "react";
import { View, Text, StyleSheet, LayoutChangeEvent } from "react-native";
import Svg, { Circle, Text as SvgText, Line } from "react-native-svg";
import * as DBController from "../../DatabaseController";
import { createMonthYearPair } from "../../Utils";
import { imageData } from "../../../assets/categoryImages/imageData";

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

  const generateCharData = (): ChartEntry[] => {
    const totalSum = expenses.reduce((sum, e) => sum + e.price, 0);
    const expenseMap = collectExpensesPerCategory();
    const generatedData: ChartEntry[] = [];
    let angle = 0;

    expenseMap.forEach((values, key) => {
      const categorySum = values.reduce((sum, e) => sum + e.price, 0);
      const percent = categorySum / totalSum;
      const color = DBController.getCategory(db, key).color;

      generatedData.push({
        category: DBController.getCategory(db, key),
        categorySum: categorySum,
        angle: angle,
        color: color ?? "#808080",
        percent: percent,
      });
      angle += percent * 360;
    });

    return generatedData;
  };

  const projectCoordinatesToBorder = (x: number, y: number, angle: number) => {
    const pad = svgDim; //subtract or add the pad to shrink screen,
    const leftBorder = 0; //removing the need to pad after calculation (which is harder)
    const rightBorder = width - pad;
    const topBorder = 0;
    const bottomBorder = layout.height - pad;
    const slope = (y - layout.centerY) / (x - centerX);
    const intersectionLeft = slope * (leftBorder - centerX) + layout.centerY;
    const intersectionRight = slope * (rightBorder - centerX) + layout.centerY;
    const intersectionTop = (topBorder - layout.centerY) / slope + centerX;
    const intersectionBottom = (bottomBorder - layout.centerY) / slope + centerX;
    //If at the bottom, otherwise...
    const yLineDeviation = 0 <= angle && angle <= 180 ? 0 : svgDim;
    //If on the left, otherwise...
    const xLineDeviation = 90 <= angle && angle <= 270 ? svgDim : 0;
    //If the line intersects on the top and bottom
    if (leftBorder < intersectionBottom && intersectionBottom < rightBorder) {
      return 0 <= angle && angle <= 180
        ? [
            intersectionBottom,
            bottomBorder,
            intersectionBottom + xLineDeviation,
            bottomBorder + yLineDeviation,
          ]
        : [
            intersectionTop,
            topBorder,
            intersectionTop + xLineDeviation,
            topBorder + yLineDeviation,
          ];
    }
    return 90 <= angle && angle <= 270
      ? [
          leftBorder,
          intersectionLeft,
          leftBorder + xLineDeviation,
          intersectionLeft + yLineDeviation,
        ]
      : [
          rightBorder,
          intersectionRight,
          rightBorder + xLineDeviation,
          intersectionRight + yLineDeviation,
        ];
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
      const imageSource = imageData[imageId].source;
      const angleUntil = index == chartData.length - 1 ? 360.0 : chartData[index + 1].angle;
      const middleAngle = (chartArc.angle + angleUntil) / 2;
      const angleRadians = (middleAngle * Math.PI) / 180.0; // - bcs we want counter clockwise
      const middleOfArcX = centerX + (radius + 30) * Math.cos(angleRadians);
      const middleOfArcY = layout.centerY + (radius + 30) * Math.sin(angleRadians);
      const imagePosition = projectCoordinatesToBorder(middleOfArcX, middleOfArcY, middleAngle);
      generatedImagePositions.push({
        svg: imageSource,
        x1: middleOfArcX,
        y1: middleOfArcY,
        x2: imagePosition[2],
        y2: imagePosition[3],
        posX: imagePosition[0],
        posY: imagePosition[1],
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

  const onLayout = (event: LayoutChangeEvent) => {
    const onLayoutHeight = event.nativeEvent.layout.height;

    if (onLayoutHeight > 0 && layout.height !== onLayoutHeight) {
      setLayout({ height: onLayoutHeight, centerY: onLayoutHeight / 2 });
    }
  };

  const Test: any = imageData[0].source;

  return (
    <View style={{ flex: 1 }} onLayout={onLayout}>
      {/* <Text>x: {categoryImagePositions[0]?.middleArcX.toFixed(2) ?? ''} y: {categoryImagePositions[0]?.middleArcY.toFixed(2) ?? ''}</Text>
      <Text>x: {categoryImagePositions[1]?.posX.toFixed(2) ?? ''} y: {categoryImagePositions[1]?.posY.toFixed(2) ?? ''}</Text>
      <Text>size: {categoryImagePositions.length}</Text> */}
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

const styles = StyleSheet.create({});

export default ChartExpenses;
