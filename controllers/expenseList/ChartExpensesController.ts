import { SQLiteAnyDatabase } from "expo-sqlite/build/NativeStatement";
import * as DBOController from "../database/DatabaseOperationsController";

export interface ChartEntry {
  category: Category;
  categorySum: number;
  color: string;
  angle: number;
  percent: number;
}

export interface CategoryImage {
  svgUri: string;
  color: string;
  posX: number;
  posY: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export class ChartExpensesController {
  expenses: Expense[];
  currency: string;
  db: SQLiteAnyDatabase;
  width: number;
  height: number;
  svgDim: number;
  centerX: number;
  centerY: number;
  radius: number;
  imageUris: string[];
  chartData: ChartEntry[];
  imagePositions: CategoryImage[];

  constructor(
    expenses: Expense[],
    db: SQLiteAnyDatabase,
    width: number,
    height: number,
    svgDim: number,
    radius: number,
    imageUris: string[],
  ) {
    this.expenses = expenses;
    this.db = db;
    this.width = width;
    this.height = height;
    this.svgDim = svgDim;
    this.radius = radius;
    this.imageUris = imageUris;

    // Calculate the center points based on width and height
    this.centerX = width / 2;
    this.centerY = height / 2;

    this.currency = this.expenses[0]?.profile_currency ?? "€";
    this.chartData = this.generateCharData();
    this.imagePositions = this.calculateCategoryImagePositions();
  }

  /**
   * Collect all the expenses based on their category name
   * @returns the categoty-expenses map
   */
  private collectExpensesPerCategory(expenses: Expense[]): Map<string, Expense[]> {
    const expenseMap = new Map<string, Expense[]>();

    expenses.forEach((e) => {
      const category = e.category_name;
      if (!expenseMap.has(category)) {
        expenseMap.set(category, []);
      }
      expenseMap.get(category)!.push(e);
    });

    return expenseMap;
  }

  private isBottomHalf(angle: number) {
    return 0 <= angle && angle <= 180;
  }

  private isLeftHalf(angle: number) {
    return 90 <= angle && angle <= 270;
  }

  private btwn(x: number, y: number, z: number) {
    return x <= y && y <= z;
  }

  public projectToBorder(x: number, y: number, angle: number) {
    const pad = this.svgDim; //subtract or add the pad to shrink screen,
    const leftBorder = 0; //removing the need to pad after calculation (which is harder)
    const rightBorder = this.width - 5 - pad;
    const topBorder = 0;
    const bottomBorder = this.height - pad;
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const slope = (y - centerY) / (x - centerX);
    const intersectionLeft = slope * (leftBorder - centerX) + centerY;
    const intersectionRight = slope * (rightBorder - centerX) + centerY;
    const intersectionTop = (topBorder - centerY) / slope + centerX;
    const intersectionBottom = (bottomBorder - centerY) / slope + centerX;
    //If at the bottom, otherwise...
    const yLineDeviation = this.isBottomHalf(angle) ? 0 : this.svgDim;
    //If on the left, otherwise...
    const xLineDeviation = this.isLeftHalf(angle) ? this.svgDim : 0;
    //If the line intersects on the top and bottom
    if (this.btwn(leftBorder, intersectionBottom, rightBorder) && this.isBottomHalf(angle)) {
      return [
        intersectionBottom,
        bottomBorder,
        intersectionBottom + xLineDeviation,
        bottomBorder + yLineDeviation,
      ];
    } else if (this.btwn(leftBorder, intersectionTop, rightBorder) && !this.isBottomHalf(angle)) {
      return [
        intersectionTop,
        topBorder,
        intersectionTop + xLineDeviation,
        topBorder + yLineDeviation,
      ];
    } else if (this.btwn(topBorder, intersectionLeft, bottomBorder) && this.isLeftHalf(angle)) {
      return [
        leftBorder,
        intersectionLeft,
        leftBorder + xLineDeviation,
        intersectionLeft + yLineDeviation,
      ];
    }
    return [
      rightBorder,
      intersectionRight,
      rightBorder + xLineDeviation,
      intersectionRight + yLineDeviation,
    ];
  }

  /**
   * Sorts an array to alternate between the largest and smallest remaining values.
   * This creates a pattern of a big value, a small value, and so on.
   *
   * @param {number[]} arr - The array of numbers to be sorted.
   * @returns {number[]} A new array with values sorted in an alternating large-small pattern.
   */
  private alternateSort(arr: { sum: number; category: Category }[]) {
    arr.sort((a, b) => a.sum - b.sum);

    const result = [];
    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
      if (right >= left) result.push(arr[right--]);
      if (left <= right) result.push(arr[left++]);
    }

    return result;
  }

  /**
   * Function to generate the data necessary to display the expense chart.
   * @returns the data to generate the pie chart.
   */
  generateCharData = (): ChartEntry[] => {
    const totalSum = this.expenses.reduce((sum, e) => sum + e.price, 0);
    const expenseMap = this.collectExpensesPerCategory(this.expenses);
    const categorySumPair: { category: Category; sum: number }[] = [];
    let angle = 0;

    expenseMap.forEach((values, key) => {
      const c = DBOController.getCategoryByName(this.db, key);
      if (!c) return;
      categorySumPair.push({ category: c, sum: values.reduce((sum, e) => sum + e.price, 0) });
    });

    const sortedSumPair = this.alternateSort(categorySumPair);

    const generatedData: ChartEntry[] = sortedSumPair.map((v) => {
      const percent = v.sum / totalSum;
      const data: ChartEntry = {
        category: v.category,
        categorySum: v.sum,
        color: v.category.color ?? "#808080",
        angle: angle,
        percent: percent,
      };
      angle += 360 * percent;
      return data;
    });

    return generatedData;
  };

  /**
   * Goes through the chart data to generate the category image positions.
   * The postion of the middle of the arc is also provided so the line can
   * be drawn from the image to the chart.
   */
  calculateCategoryImagePositions(): CategoryImage[] {
    const generatedImagePositions: CategoryImage[] = [];

    this.chartData.forEach((chartArc, index) => {
      if (chartArc.categorySum == 0) return;
      const imageId = chartArc.category.image_id;
      if (imageId === null) {
        console.log("This category has no imageId attached", chartArc.category);
        return;
      }
      const imageUri = this.imageUris[imageId];
      const angleUntil =
        index == this.chartData.length - 1 ? 360.0 : this.chartData[index + 1].angle;
      const mdlAngle = (chartArc.angle + angleUntil) / 2;
      const angleRadians = (mdlAngle * Math.PI) / 180.0; // - bcs we want counter clockwise
      const mdlArcX = this.centerX + (this.radius + 30) * Math.cos(angleRadians);
      const mdlArcY = this.centerY + (this.radius + 30) * Math.sin(angleRadians);
      const imgPos = this.projectToBorder(mdlArcX, mdlArcY, mdlAngle);
      generatedImagePositions.push({
        svgUri: imageUri,
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
  }
}
