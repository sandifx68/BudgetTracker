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
