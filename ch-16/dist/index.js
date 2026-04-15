"use strict";
class DateRange {
    constructor(s, e) {
        this.s = s;
        this.e = e;
    }
    contains(d) {
        return d >= this.s && d <= this.e;
    }
    getWeeks() {
        return Math.ceil((this.e - this.s + 1) / 7);
    }
    getMonths() {
        return Math.round((this.e - this.s + 1) / 30);
    }
    toArray() {
        const result = [];
        for (let i = this.s; i <= this.e; i++) {
            result.push(i);
        }
        return result;
    }
    serialize() {
        return JSON.stringify({ start: this.s, end: this.e, version: 2 });
    }
    getDayOfWeek(d) {
        return ((d % 7) + 4) % 7;
    }
    overlaps(other) {
        return this.s <= other.e && this.e >= other.s;
    }
    getS() {
        return this.s;
    }
    getE() {
        return this.e;
    }
    isWeekend(d) {
        const dow = this.getDayOfWeek(d);
        return dow === 0 || dow === 6;
    }
}
var DayOfWeek;
(function (DayOfWeek) {
    DayOfWeek[DayOfWeek["Sunday"] = 0] = "Sunday";
    DayOfWeek[DayOfWeek["Monday"] = 1] = "Monday";
    DayOfWeek[DayOfWeek["Tuesday"] = 2] = "Tuesday";
    DayOfWeek[DayOfWeek["Wednesday"] = 3] = "Wednesday";
    DayOfWeek[DayOfWeek["Thursday"] = 4] = "Thursday";
    DayOfWeek[DayOfWeek["Friday"] = 5] = "Friday";
    DayOfWeek[DayOfWeek["Saturday"] = 6] = "Saturday";
})(DayOfWeek || (DayOfWeek = {}));
var DateUnit;
(function (DateUnit) {
    DateUnit[DateUnit["DaysPerWeek"] = 7] = "DaysPerWeek";
    DateUnit[DateUnit["AverageDaysPerMonth"] = 30] = "AverageDaysPerMonth";
})(DateUnit || (DateUnit = {}));
class OrdinalDate {
    constructor(daysSinceEpoch) {
        this.daysSinceEpoch = daysSinceEpoch;
    }
    getDaysSinceEpoch() {
        return this.daysSinceEpoch;
    }
    getDayOfWeek() {
        return ((this.daysSinceEpoch % DateUnit.DaysPerWeek) + DayOfWeek.Thursday) % DateUnit.DaysPerWeek;
    }
    isWeekend() {
        const dayOfWeek = this.getDayOfWeek();
        return dayOfWeek === DayOfWeek.Sunday || dayOfWeek === DayOfWeek.Saturday;
    }
    isOnOrAfter(other) {
        return this.daysSinceEpoch >= other.daysSinceEpoch;
    }
    isOnOrBefore(other) {
        return this.daysSinceEpoch <= other.daysSinceEpoch;
    }
}
class CalendarDateRange {
    constructor(startDate, endDate) {
        if (startDate.getDaysSinceEpoch() > endDate.getDaysSinceEpoch()) {
            throw new Error("Start date must not be after end date");
        }
        this.startDate = startDate;
        this.endDate = endDate;
    }
    includesDate(date) {
        return date.isOnOrAfter(this.startDate) && date.isOnOrBefore(this.endDate);
    }
    overlapsWith(other) {
        return this.startDate.isOnOrBefore(other.endDate)
            && this.endDate.isOnOrAfter(other.startDate);
    }
    getSpanInDays() {
        return this.endDate.getDaysSinceEpoch() - this.startDate.getDaysSinceEpoch() + 1;
    }
    getSpanInWeeks() {
        return Math.ceil(this.getSpanInDays() / DateUnit.DaysPerWeek);
    }
    getApproximateSpanInMonths() {
        return Math.round(this.getSpanInDays() / DateUnit.AverageDaysPerMonth);
    }
    getStartDate() {
        return this.startDate;
    }
    getEndDate() {
        return this.endDate;
    }
}
console.log("=== Chapter 16: Refactoring SerialDate ===\n");
console.log("--- BEFORE: DateRange (vague names, magic numbers, dead methods) ---");
const oldRange = new DateRange(0, 30);
console.log("Contains day 15:", oldRange.contains(15));
console.log("Contains day 45:", oldRange.contains(45));
console.log("Weeks:", oldRange.getWeeks());
console.log("Months:", oldRange.getMonths());
console.log("Day of week for day 3:", oldRange.getDayOfWeek(3));
console.log("Is day 5 a weekend:", oldRange.isWeekend(5));
console.log();
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
console.log("--- Enums replace magic numbers ---");
const thursday = new OrdinalDate(0);
const friday = new OrdinalDate(1);
const saturday = new OrdinalDate(2);
const sunday = new OrdinalDate(3);
console.log(`Day 0 (Thursday): dayOfWeek=${DayOfWeek[thursday.getDayOfWeek()]}, weekend=${thursday.isWeekend()}`);
console.log(`Day 1 (Friday):   dayOfWeek=${DayOfWeek[friday.getDayOfWeek()]}, weekend=${friday.isWeekend()}`);
console.log(`Day 2 (Saturday): dayOfWeek=${DayOfWeek[saturday.getDayOfWeek()]}, weekend=${saturday.isWeekend()}`);
console.log(`Day 3 (Sunday):   dayOfWeek=${DayOfWeek[sunday.getDayOfWeek()]}, weekend=${sunday.isWeekend()}`);
console.log();
console.log("--- Overlap detection with clear method names ---");
const rangeA = new CalendarDateRange(new OrdinalDate(0), new OrdinalDate(10));
const rangeB = new CalendarDateRange(new OrdinalDate(5), new OrdinalDate(15));
const rangeC = new CalendarDateRange(new OrdinalDate(20), new OrdinalDate(30));
console.log("Range 0-10 overlaps 5-15:", rangeA.overlapsWith(rangeB));
console.log("Range 0-10 overlaps 20-30:", rangeA.overlapsWith(rangeC));
