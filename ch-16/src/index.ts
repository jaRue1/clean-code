// Refactoring SerialDate
// "Even well-written code can be improved, and the willingness to improve it
// separates professional developers from the rest."

// ============================================================================
// 1. BEFORE: DateRange with vague names, magic numbers, and dead methods
// ============================================================================

class DateRange {
  private s: number; // start as days since epoch
  private e: number; // end as days since epoch

  constructor(s: number, e: number) {
    this.s = s;
    this.e = e;
  }

  // Vague name: what does "contains" mean? A date? Another range?
  contains(d: number): boolean {
    return d >= this.s && d <= this.e;
  }

  // Magic number: 7 means days in a week
  getWeeks(): number {
    return Math.ceil((this.e - this.s + 1) / 7);
  }

  // Magic number: 30 used as approximate month length
  getMonths(): number {
    return Math.round((this.e - this.s + 1) / 30);
  }

  // Dead method: never called, left "just in case"
  toArray(): number[] {
    const result: number[] = [];
    for (let i = this.s; i <= this.e; i++) {
      result.push(i);
    }
    return result;
  }

  // Dead method: leftover from a previous requirement
  serialize(): string {
    return JSON.stringify({ start: this.s, end: this.e, version: 2 });
  }

  // Magic numbers for day-of-week calculation
  getDayOfWeek(d: number): number {
    return ((d % 7) + 4) % 7; // 0 = Sunday... but why +4?
  }

  // Vague name: what does "overlaps" return?
  overlaps(other: DateRange): boolean {
    return this.s <= other.e && this.e >= other.s;
  }

  // Implementation detail leaking: exposes raw epoch days
  getS(): number {
    return this.s;
  }

  getE(): number {
    return this.e;
  }

  // Method using a constant that should be an enum
  isWeekend(d: number): boolean {
    const dow = this.getDayOfWeek(d);
    return dow === 0 || dow === 6; // 0 = Sunday, 6 = Saturday... or is it?
  }
}

// ============================================================================
// 2. AFTER: CalendarDateRange with enums, clear names, no dead code
// ============================================================================

enum DayOfWeek {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
}

enum DateUnit {
  DaysPerWeek = 7,
  AverageDaysPerMonth = 30,
}

// Represents a simple date as days since a reference epoch (e.g. Unix epoch)
class OrdinalDate {
  private readonly daysSinceEpoch: number;

  constructor(daysSinceEpoch: number) {
    this.daysSinceEpoch = daysSinceEpoch;
  }

  getDaysSinceEpoch(): number {
    return this.daysSinceEpoch;
  }

  getDayOfWeek(): DayOfWeek {
    // Thursday was day 0 of Unix epoch (Jan 1, 1970)
    return ((this.daysSinceEpoch % DateUnit.DaysPerWeek) + DayOfWeek.Thursday) % DateUnit.DaysPerWeek;
  }

  isWeekend(): boolean {
    const dayOfWeek = this.getDayOfWeek();
    return dayOfWeek === DayOfWeek.Sunday || dayOfWeek === DayOfWeek.Saturday;
  }

  isOnOrAfter(other: OrdinalDate): boolean {
    return this.daysSinceEpoch >= other.daysSinceEpoch;
  }

  isOnOrBefore(other: OrdinalDate): boolean {
    return this.daysSinceEpoch <= other.daysSinceEpoch;
  }
}

class CalendarDateRange {
  private readonly startDate: OrdinalDate;
  private readonly endDate: OrdinalDate;

  constructor(startDate: OrdinalDate, endDate: OrdinalDate) {
    if (startDate.getDaysSinceEpoch() > endDate.getDaysSinceEpoch()) {
      throw new Error("Start date must not be after end date");
    }
    this.startDate = startDate;
    this.endDate = endDate;
  }

  includesDate(date: OrdinalDate): boolean {
    return date.isOnOrAfter(this.startDate) && date.isOnOrBefore(this.endDate);
  }

  overlapsWith(other: CalendarDateRange): boolean {
    return this.startDate.isOnOrBefore(other.endDate)
      && this.endDate.isOnOrAfter(other.startDate);
  }

  getSpanInDays(): number {
    return this.endDate.getDaysSinceEpoch() - this.startDate.getDaysSinceEpoch() + 1;
  }

  getSpanInWeeks(): number {
    return Math.ceil(this.getSpanInDays() / DateUnit.DaysPerWeek);
  }

  getApproximateSpanInMonths(): number {
    return Math.round(this.getSpanInDays() / DateUnit.AverageDaysPerMonth);
  }

  getStartDate(): OrdinalDate {
    return this.startDate;
  }

  getEndDate(): OrdinalDate {
    return this.endDate;
  }
}

// ============================================================================
// Run examples
// ============================================================================

console.log("=== Chapter 16: Refactoring SerialDate ===\n");

// BEFORE: Vague names and magic numbers
console.log("--- BEFORE: DateRange (vague names, magic numbers, dead methods) ---");
const oldRange = new DateRange(0, 30);
console.log("Contains day 15:", oldRange.contains(15));
console.log("Contains day 45:", oldRange.contains(45));
console.log("Weeks:", oldRange.getWeeks());
console.log("Months:", oldRange.getMonths());
console.log("Day of week for day 3:", oldRange.getDayOfWeek(3));
console.log("Is day 5 a weekend:", oldRange.isWeekend(5));
// Dead methods exist but should not: oldRange.toArray(), oldRange.serialize()
console.log();

// AFTER: Clear names and enums
console.log("--- AFTER: CalendarDateRange (clear names, enums, no dead code) ---");
const startDate = new OrdinalDate(0);
const endDate = new OrdinalDate(30);
const calendarRange = new CalendarDateRange(startDate, endDate);

const dayToCheck = new OrdinalDate(15);
const dayOutsideRange = new OrdinalDate(45);

console.log("Includes day 15:", calendarRange.includesDate(dayToCheck));
console.log("Includes day 45:", calendarRange.includesDate(dayOutsideRange));
console.log("Span in days:", calendarRange.getSpanInDays());
console.log("Span in weeks:", calendarRange.getSpanInWeeks());
console.log("Approximate span in months:", calendarRange.getApproximateSpanInMonths());
console.log();

// Enums make day-of-week crystal clear
console.log("--- Enums replace magic numbers ---");
const thursday = new OrdinalDate(0); // Unix epoch was a Thursday
const friday = new OrdinalDate(1);
const saturday = new OrdinalDate(2);
const sunday = new OrdinalDate(3);

console.log(`Day 0 (Thursday): dayOfWeek=${DayOfWeek[thursday.getDayOfWeek()]}, weekend=${thursday.isWeekend()}`);
console.log(`Day 1 (Friday):   dayOfWeek=${DayOfWeek[friday.getDayOfWeek()]}, weekend=${friday.isWeekend()}`);
console.log(`Day 2 (Saturday): dayOfWeek=${DayOfWeek[saturday.getDayOfWeek()]}, weekend=${saturday.isWeekend()}`);
console.log(`Day 3 (Sunday):   dayOfWeek=${DayOfWeek[sunday.getDayOfWeek()]}, weekend=${sunday.isWeekend()}`);
console.log();

// Overlap detection
console.log("--- Overlap detection with clear method names ---");
const rangeA = new CalendarDateRange(new OrdinalDate(0), new OrdinalDate(10));
const rangeB = new CalendarDateRange(new OrdinalDate(5), new OrdinalDate(15));
const rangeC = new CalendarDateRange(new OrdinalDate(20), new OrdinalDate(30));

console.log("Range 0-10 overlaps 5-15:", rangeA.overlapsWith(rangeB));
console.log("Range 0-10 overlaps 20-30:", rangeA.overlapsWith(rangeC));
