interface MonthYearPair {
  month: string;
  year: string;
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * Get the month index from the period.
 * @param period the period of the expense (take the form of a key)
 * @returns the index starting from the current month
 */
function inverseMonthIndex(period: string): number {
  const monthYear = period.split(" ");
  const month = months.findIndex((m) => m == monthYear[0]);
  const year = parseInt(monthYear[1]);
  return dateDifference(new Date(), new Date(year, month, 1));
}

/**
 * Creates a pair representing the month and year given the index.
 * @param index the index representing the distance in months from the current date.
 * @returns the date as a string (i.e. Aug 2023)
 */
export function createMonthYearPair(index: number): MonthYearPair {
  const currMonth = new Date().getMonth();
  const currYear = new Date().getFullYear();
  const month = (12 + ((currMonth - index) % 12)) % 12;
  const year = currYear - Math.floor((index - currMonth - 1) / 12 + 1);
  return { month: months[month], year: year.toString() };
}

/**
 * Returns the amount of months between start date and end date.
 * @param startDate the start date
 * @param endDate the end date
 * @returns the amount of months between startDate and endDate.
 */
export function dateDifference(startDate: Date, endDate: Date) {
  return (
    startDate.getFullYear() * 12 +
    startDate.getMonth() -
    endDate.getFullYear() * 12 -
    endDate.getMonth()
  );
}

/**
 * Calculated the money spent in the respective period (month)
 * @param expenseArray an array of expenses, sorted by month
 * @param period the period that needs to be calculated
 * @returns the sum spent in the whole month (period)
 */
export function calculateMonthlySpent(expenseArray: Expense[][], period: string): number {
  const index = inverseMonthIndex(period);
  return expenseArray[index].reduce((partialSum, e) => partialSum + e.price, 0);
}
