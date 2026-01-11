/**
 * Unit tests for calendar utility functions.
 * Tests Monday-first week layout and date calculations.
 */

import {
  getMondayFirstDayIndex,
  getDaysInMonth,
  getMonthName,
  generateMonthData,
  isSameDay,
  formatDateKey,
} from '../calendar';

describe('getMondayFirstDayIndex', () => {
  it('should return 0 for Monday', () => {
    const monday = new Date('2026-01-05'); // Monday
    expect(getMondayFirstDayIndex(monday)).toBe(0);
  });

  it('should return 1 for Tuesday', () => {
    const tuesday = new Date('2026-01-06'); // Tuesday
    expect(getMondayFirstDayIndex(tuesday)).toBe(1);
  });

  it('should return 6 for Sunday (last day of week)', () => {
    const sunday = new Date('2026-01-04'); // Sunday
    expect(getMondayFirstDayIndex(sunday)).toBe(6);
  });

  it('should return 5 for Saturday', () => {
    const saturday = new Date('2026-01-03'); // Saturday
    expect(getMondayFirstDayIndex(saturday)).toBe(5);
  });
});

describe('getDaysInMonth', () => {
  it('should return 31 for January 2026', () => {
    expect(getDaysInMonth(2026, 0)).toBe(31);
  });

  it('should return 28 for February 2026 (non-leap year)', () => {
    expect(getDaysInMonth(2026, 1)).toBe(28);
  });

  it('should return 29 for February 2024 (leap year)', () => {
    expect(getDaysInMonth(2024, 1)).toBe(29);
  });

  it('should return 30 for April 2026', () => {
    expect(getDaysInMonth(2026, 3)).toBe(30);
  });

  it('should return 31 for December 2026', () => {
    expect(getDaysInMonth(2026, 11)).toBe(31);
  });
});

describe('getMonthName', () => {
  it('should return correct month names', () => {
    expect(getMonthName(0)).toBe('January');
    expect(getMonthName(1)).toBe('February');
    expect(getMonthName(2)).toBe('March');
    expect(getMonthName(11)).toBe('December');
  });
});

describe('generateMonthData', () => {
  describe('January 2026', () => {
    // January 2026 starts on Thursday (Mon-first index = 3)
    const monthData = generateMonthData(2026, 0);

    it('should have correct month metadata', () => {
      expect(monthData.year).toBe(2026);
      expect(monthData.month).toBe(0);
      expect(monthData.monthName).toBe('January');
      expect(monthData.daysInMonth).toBe(31);
    });

    it('should start with 3 blank cells (Thu is Mon-first index 3)', () => {
      expect(monthData.cells[0].type).toBe('blank');
      expect(monthData.cells[1].type).toBe('blank');
      expect(monthData.cells[2].type).toBe('blank');
      expect(monthData.cells[3].type).toBe('day');
    });

    it('should have day 1 at index 3', () => {
      const cell = monthData.cells[3];
      if (cell.type === 'day') {
        expect(cell.value).toBe(1);
      } else {
        fail('Cell should be a day cell');
      }
    });

    it('should have all 31 days', () => {
      const dayCells = monthData.cells.filter(c => c.type === 'day');
      expect(dayCells.length).toBe(31);
    });

    it('should pad to complete weeks (multiple of 7)', () => {
      expect(monthData.cells.length % 7).toBe(0);
    });

    it('should place Sundays in the last column (index 6, 13, 20, etc.)', () => {
      // Jan 4, 11, 18, 25 are Sundays in 2026
      // They should be at positions 6, 13, 20, 27 (Sunday column)
      const sundayIndices = [6, 13, 20, 27];
      const expectedSundayDays = [4, 11, 18, 25];

      sundayIndices.forEach((idx, i) => {
        const cell = monthData.cells[idx];
        if (cell.type === 'day') {
          expect(cell.value).toBe(expectedSundayDays[i]);
          expect(getMondayFirstDayIndex(cell.date)).toBe(6);
        } else {
          fail(`Cell at index ${idx} should be a Sunday (day ${expectedSundayDays[i]})`);
        }
      });
    });

    it('should place Mondays in the first column (index 0, 7, 14, etc.)', () => {
      // Jan 5, 12, 19, 26 are Mondays in 2026
      // They should be at positions 7, 14, 21, 28 (Monday column, after first 3 blanks)
      const mondayIndices = [7, 14, 21, 28];
      const expectedMondayDays = [5, 12, 19, 26];

      mondayIndices.forEach((idx, i) => {
        const cell = monthData.cells[idx];
        if (cell.type === 'day') {
          expect(cell.value).toBe(expectedMondayDays[i]);
          expect(getMondayFirstDayIndex(cell.date)).toBe(0);
        } else {
          fail(`Cell at index ${idx} should be a Monday (day ${expectedMondayDays[i]})`);
        }
      });
    });
  });

  describe('February 2024 (leap year)', () => {
    // February 2024 starts on Thursday (Mon-first index = 3)
    const monthData = generateMonthData(2024, 1);

    it('should have 29 days', () => {
      expect(monthData.daysInMonth).toBe(29);
      const dayCells = monthData.cells.filter(c => c.type === 'day');
      expect(dayCells.length).toBe(29);
    });

    it('should start with 3 blank cells', () => {
      expect(monthData.cells[0].type).toBe('blank');
      expect(monthData.cells[1].type).toBe('blank');
      expect(monthData.cells[2].type).toBe('blank');
      expect(monthData.cells[3].type).toBe('day');
    });
  });

  describe('September 2025', () => {
    // September 2025 starts on Monday (Mon-first index = 0)
    const monthData = generateMonthData(2025, 8);

    it('should have no leading blank cells when starting on Monday', () => {
      expect(monthData.cells[0].type).toBe('day');
      const cell = monthData.cells[0];
      if (cell.type === 'day') {
        expect(cell.value).toBe(1);
      }
    });

    it('should have 30 days', () => {
      expect(monthData.daysInMonth).toBe(30);
      const dayCells = monthData.cells.filter(c => c.type === 'day');
      expect(dayCells.length).toBe(30);
    });
  });

  describe('March 2026', () => {
    // March 2026 starts on Sunday (Mon-first index = 6)
    const monthData = generateMonthData(2026, 2);

    it('should have 6 leading blank cells when starting on Sunday', () => {
      for (let i = 0; i < 6; i++) {
        expect(monthData.cells[i].type).toBe('blank');
      }
      expect(monthData.cells[6].type).toBe('day');
      const cell = monthData.cells[6];
      if (cell.type === 'day') {
        expect(cell.value).toBe(1);
      }
    });
  });
});

describe('isSameDay', () => {
  it('should return true for same day', () => {
    const date1 = new Date('2026-01-15T10:00:00');
    const date2 = new Date('2026-01-15T18:30:00');
    expect(isSameDay(date1, date2)).toBe(true);
  });

  it('should return false for different days', () => {
    const date1 = new Date('2026-01-15');
    const date2 = new Date('2026-01-16');
    expect(isSameDay(date1, date2)).toBe(false);
  });

  it('should return false for same day in different months', () => {
    const date1 = new Date('2026-01-15');
    const date2 = new Date('2026-02-15');
    expect(isSameDay(date1, date2)).toBe(false);
  });

  it('should return false for same day in different years', () => {
    const date1 = new Date('2026-01-15');
    const date2 = new Date('2025-01-15');
    expect(isSameDay(date1, date2)).toBe(false);
  });
});

describe('formatDateKey', () => {
  it('should format date as YYYY-MM-DD', () => {
    const date = new Date('2026-01-15');
    expect(formatDateKey(date)).toBe('2026-01-15');
  });

  it('should pad single-digit months and days with zeros', () => {
    const date = new Date('2026-03-05');
    expect(formatDateKey(date)).toBe('2026-03-05');
  });

  it('should handle December correctly', () => {
    const date = new Date('2026-12-31');
    expect(formatDateKey(date)).toBe('2026-12-31');
  });

  it('should handle January 1st correctly', () => {
    const date = new Date('2026-01-01');
    expect(formatDateKey(date)).toBe('2026-01-01');
  });
});

describe('Edge cases and comprehensive coverage', () => {
  it('should handle all months of 2026 correctly', () => {
    for (let month = 0; month < 12; month++) {
      const monthData = generateMonthData(2026, month);

      // All generated grids should be multiples of 7
      expect(monthData.cells.length % 7).toBe(0);

      // Should have correct number of day cells
      const dayCells = monthData.cells.filter(c => c.type === 'day');
      expect(dayCells.length).toBe(getDaysInMonth(2026, month));

      // First day cell should be day 1
      const firstDayCell = monthData.cells.find(c => c.type === 'day');
      expect(firstDayCell?.type).toBe('day');
      if (firstDayCell?.type === 'day') {
        expect(firstDayCell.value).toBe(1);
      }
    }
  });

  it('should correctly align weeks for year 2026', () => {
    // Test a few specific dates to ensure Sunday is always in column 6
    const testCases = [
      { month: 0, day: 4, expectedIndex: 6 },   // Jan 4 (Sun) should be at index 6
      { month: 0, day: 11, expectedIndex: 13 }, // Jan 11 (Sun) should be at index 13
      { month: 5, day: 7, expectedIndex: 6 },   // Jun 7 (Sun) should be at index 6
    ];

    testCases.forEach(({ month, day, expectedIndex }) => {
      const monthData = generateMonthData(2026, month);
      const cell = monthData.cells[expectedIndex];

      if (cell.type === 'day') {
        expect(cell.value).toBe(day);
        expect(getMondayFirstDayIndex(cell.date)).toBe(6); // Sunday = 6
      } else {
        fail(`Cell at index ${expectedIndex} should be day ${day}`);
      }
    });
  });
});
