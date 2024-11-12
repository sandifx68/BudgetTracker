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
export function createMonthYearKey(index: number): string {
  const currMonth = new Date().getMonth();
  const currYear = new Date().getFullYear();
  const month = (12 + ((currMonth - index) % 12)) % 12;
  const year = currYear - Math.floor((index - currMonth - 1) / 12 + 1);
  return `${months[month]} ${year}`;
}

/**
 * Creates a Date object from the given index.
 * @param index the index representing the distance in months from the current date.
 * @return the date with the year and month from the index
 */
export function createDateFromIndex(index: number): Date {
  const currMonth = new Date().getMonth();
  const currYear = new Date().getFullYear();
  const month = (12 + ((currMonth - index) % 12)) % 12;
  const year = currYear - Math.floor((index - currMonth - 1) / 12 + 1);
  return new Date(year, month);
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
