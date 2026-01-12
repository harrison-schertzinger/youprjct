/**
 * Calendar utility functions for date calculations with Monday-first week layout.
 *
 * In this implementation:
 * - Weeks start on Monday (index 0)
 * - Sunday is the last day (index 6)
 */

export type CalendarCell =
  | { type: 'blank' }
  | { type: 'day'; value: number; date: Date; dateKey: string };

export interface MonthData {
  year: number;
  month: number; // 0-11 (January = 0)
  monthName: string;
  daysInMonth: number;
  cells: CalendarCell[];
}

/**
 * Get the day of week index for Monday-first layout.
 * @param date - The date to check
 * @returns 0 for Monday, 1 for Tuesday, ..., 6 for Sunday
 */
export function getMondayFirstDayIndex(date: Date): number {
  const jsDay = date.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
  // Convert to Monday-first: Monday=0, ..., Sunday=6
  return jsDay === 0 ? 6 : jsDay - 1;
}

/**
 * Get the number of days in a given month.
 * @param year - Full year (e.g., 2026)
 * @param month - Month index (0-11, where 0 = January)
 * @returns Number of days in the month
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Get the month name from a month index.
 * @param month - Month index (0-11)
 * @returns Month name (e.g., "January")
 */
export function getMonthName(month: number): string {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return monthNames[month];
}

/**
 * Generate calendar grid data for a given month with Monday-first layout.
 * Creates blank cells before the first day and after the last day to complete weeks.
 * Ensures Sundays always appear in the last column (index 6).
 *
 * @param year - Full year (e.g., 2026)
 * @param month - Month index (0-11, where 0 = January)
 * @returns MonthData object containing all calendar information
 */
export function generateMonthData(year: number, month: number): MonthData {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDate = new Date(year, month, 1);
  const firstDayIndex = getMondayFirstDayIndex(firstDate);

  const cells: CalendarCell[] = [];

  // Add blank cells before the first day of the month
  for (let i = 0; i < firstDayIndex; i++) {
    cells.push({ type: 'blank' });
  }

  // Add cells for each day in the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    cells.push({
      type: 'day',
      value: day,
      date,
      dateKey: formatDateKey(date)
    });
  }

  // Pad with blank cells to complete the final week (multiple of 7)
  while (cells.length % 7 !== 0) {
    cells.push({ type: 'blank' });
  }

  return {
    year,
    month,
    monthName: getMonthName(month),
    daysInMonth,
    cells
  };
}

/**
 * Get calendar data for the current month.
 * @returns MonthData for the current month
 */
export function getCurrentMonthData(): MonthData {
  const now = new Date();
  return generateMonthData(now.getFullYear(), now.getMonth());
}

/**
 * Check if two dates represent the same day.
 * @param date1 - First date
 * @param date2 - Second date
 * @returns true if both dates are the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Format a date as YYYY-MM-DD for use as a key.
 * @param date - The date to format
 * @returns Date string in YYYY-MM-DD format
 */
export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
