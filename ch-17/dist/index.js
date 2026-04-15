"use strict";
function calculateTotalBad(prices) {
    let total = 0;
    for (const price of prices) {
        total += price;
    }
    return total;
}
function calculateTotal(prices) {
    return prices.reduce((sum, price) => sum + price, 0);
}
function canPurchaseAlcoholBad(age) {
    return age >= 21;
}
function computeTaxBad(amount) {
    return amount * 0.08;
}
function isLeapYearAwareDayCountBad(years) {
    return years * 365;
}
const LEGAL_DRINKING_AGE = 21;
const SALES_TAX_RATE = 0.08;
const DAYS_PER_YEAR = 365;
function canPurchaseAlcohol(age) {
    return age >= LEGAL_DRINKING_AGE;
}
function computeSalesTax(amount) {
    return amount * SALES_TAX_RATE;
}
function estimateDaysFromYears(years) {
    return years * DAYS_PER_YEAR;
}
function fn(a) {
    return a.reduce((p, c, i) => p + c * (i % 2 === 0 ? 1 : -1), 0);
}
function alternatingSum(values) {
    let sum = 0;
    for (let i = 0; i < values.length; i++) {
        const isEvenIndex = i % 2 === 0;
        const sign = isEvenIndex ? 1 : -1;
        sum += values[i] * sign;
    }
    return sum;
}
function shouldStopTimerBad(timer) {
    if (timer.hasExpired() && !timer.isRecurrent()) {
        return true;
    }
    return false;
}
function shouldBeDeleted(timer) {
    return timer.hasExpired() && !timer.isRecurrent();
}
function processTimerGood(timer) {
    if (shouldBeDeleted(timer)) {
        return "Timer deleted";
    }
    return "Timer still active";
}
function processBufferBad(buffer) {
    if (!buffer.shouldNotCompact()) {
        return "Compacting buffer";
    }
    return "Skipping compaction";
}
function processBufferGood(buffer) {
    if (buffer.shouldCompact()) {
        return "Compacting buffer";
    }
    return "Skipping compaction";
}
class ReportData {
    constructor(title, rows) {
        this.title = title;
        this.rows = rows;
    }
}
class ReportPrinterBad {
    print(data) {
        let output = `Report: ${data.title}\n`;
        output += "=".repeat(data.title.length + 8) + "\n";
        for (const row of data.rows) {
            output += `  ${row.label}: ${row.value}\n`;
        }
        const total = data.rows.reduce((sum, r) => sum + r.value, 0);
        output += `  Total: ${total}\n`;
        return output;
    }
}
class FormattedReport {
    constructor(title, rows) {
        this.title = title;
        this.rows = rows;
    }
    getTotal() {
        return this.rows.reduce((sum, row) => sum + row.value, 0);
    }
    format() {
        const header = `Report: ${this.title}`;
        const separator = "=".repeat(header.length);
        const rowLines = this.rows.map(row => `  ${row.label}: ${row.value}`);
        const totalLine = `  Total: ${this.getTotal()}`;
        return [header, separator, ...rowLines, totalLine].join("\n");
    }
}
console.log("=== Chapter 17: Smells and Heuristics ===\n");
console.log("--- 1. Commented-out code ---");
console.log("Bad (cluttered):", calculateTotalBad([10, 20, 30]));
console.log("Good (clean):  ", calculateTotal([10, 20, 30]));
console.log();
console.log("--- 2. Magic numbers ---");
console.log("Bad: canPurchaseAlcoholBad(25) =", canPurchaseAlcoholBad(25));
console.log("Good: canPurchaseAlcohol(25) =", canPurchaseAlcohol(25));
console.log("Bad: computeTaxBad(100) =", computeTaxBad(100));
console.log("Good: computeSalesTax(100) =", computeSalesTax(100));
console.log("Good: estimateDaysFromYears(2) =", estimateDaysFromYears(2));
console.log();
console.log("--- 3. Obscured intent ---");
const values = [10, 3, 8, 2, 6];
console.log("Bad:  fn([10, 3, 8, 2, 6]) =", fn(values));
console.log("Good: alternatingSum([10, 3, 8, 2, 6]) =", alternatingSum(values));
console.log();
console.log("--- 4. Encapsulate conditionals ---");
const expiredNonRecurrent = { hasExpired: () => true, isRecurrent: () => false };
const activeRecurrent = { hasExpired: () => false, isRecurrent: () => true };
console.log("Bad: shouldStopTimerBad(expired, non-recurrent):", shouldStopTimerBad(expiredNonRecurrent));
console.log("Good: shouldBeDeleted(expired, non-recurrent):", shouldBeDeleted(expiredNonRecurrent));
console.log("Good: processTimerGood(active, recurrent):", processTimerGood(activeRecurrent));
console.log();
console.log("--- 5. Negative conditionals ---");
const compactableBuffer = {
    shouldNotCompact: () => false,
    shouldCompact: () => true,
};
console.log("Bad:  processBufferBad:", processBufferBad(compactableBuffer));
console.log("Good: processBufferGood:", processBufferGood(compactableBuffer));
console.log();
console.log("--- 6. Feature envy ---");
const reportRows = [
    { label: "Revenue", value: 50000 },
    { label: "Expenses", value: 32000 },
    { label: "Profit", value: 18000 },
];
console.log("Bad: ReportPrinter reaches into ReportData:");
const badPrinter = new ReportPrinterBad();
console.log(badPrinter.print(new ReportData("Q1 Summary", reportRows)));
console.log("Good: FormattedReport owns its own formatting:");
const report = new FormattedReport("Q1 Summary", reportRows);
console.log(report.format());
