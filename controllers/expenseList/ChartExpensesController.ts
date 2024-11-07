/**
 * Collect all the expenses based on their category name
 * @returns the categoty-expenses map
 */
export function collectExpensesPerCategory(expenses: Expense[]): Map<string, Expense[]> {
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

function isBottomHalf(angle: number) {
  return 0 <= angle && angle <= 180;
}

function isLeftHalf(angle: number) {
  return 90 <= angle && angle <= 270;
}

function btwn(x: number, y: number, z: number) {
  return x <= y && y <= z;
}

export function projectToBorder(
  x: number,
  y: number,
  angle: number,
  width: number,
  height: number,
  svgDim: number,
) {
  const pad = svgDim; //subtract or add the pad to shrink screen,
  const leftBorder = 0; //removing the need to pad after calculation (which is harder)
  const rightBorder = width - pad;
  const topBorder = 0;
  const bottomBorder = height - pad;
  const centerX = width / 2;
  const centerY = height / 2;
  const slope = (y - centerY) / (x - centerX);
  const intersectionLeft = slope * (leftBorder - centerX) + centerY;
  const intersectionRight = slope * (rightBorder - centerX) + centerY;
  const intersectionTop = (topBorder - centerY) / slope + centerX;
  const intersectionBottom = (bottomBorder - centerY) / slope + centerX;
  //If at the bottom, otherwise...
  const yLineDeviation = isBottomHalf(angle) ? 0 : svgDim;
  //If on the left, otherwise...
  const xLineDeviation = isLeftHalf(angle) ? svgDim : 0;
  //If the line intersects on the top and bottom
  if (btwn(leftBorder, intersectionBottom, rightBorder) && isBottomHalf(angle)) {
    return [
      intersectionBottom,
      bottomBorder,
      intersectionBottom + xLineDeviation,
      bottomBorder + yLineDeviation,
    ];
  } else if (btwn(leftBorder, intersectionTop, rightBorder) && !isBottomHalf(angle)) {
    return [
      intersectionTop,
      topBorder,
      intersectionTop + xLineDeviation,
      topBorder + yLineDeviation,
    ];
  } else if (btwn(topBorder, intersectionLeft, bottomBorder) && isLeftHalf(angle)) {
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
