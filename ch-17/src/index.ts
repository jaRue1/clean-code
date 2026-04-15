// Smells and Heuristics
// "Clean code is not written by following a set of rules. Professionalism
// and craftsmanship come from values that drive disciplines."

// ============================================================================
// 1. Commented-out code
// ============================================================================

// Bad: blocks of commented-out code litter the file
function calculateTotalBad(prices: number[]): number {
  // const tax = 0.08;
  // const discount = 0.1;
  // const adjustedPrices = prices.map(p => p * (1 - discount));
  let total = 0;
  for (const price of prices) {
    total += price;
  }
  // if (applyTax) {
  //   total = total * (1 + tax);
  // }
  // console.log("DEBUG: total is", total);
  return total;
}

// Good: just delete it. Version control remembers everything.
function calculateTotal(prices: number[]): number {
  return prices.reduce((sum, price) => sum + price, 0);
}

// ============================================================================
// 2. Magic numbers
// ============================================================================

// Bad: what does 21 mean? What is 0.08? Why 365?
function canPurchaseAlcoholBad(age: number): boolean {
  return age >= 21;
}

function computeTaxBad(amount: number): number {
  return amount * 0.08;
}

function isLeapYearAwareDayCountBad(years: number): number {
  return years * 365;
}

// Good: named constants make the intent clear
const LEGAL_DRINKING_AGE = 21;
const SALES_TAX_RATE = 0.08;
const DAYS_PER_YEAR = 365;

function canPurchaseAlcohol(age: number): boolean {
  return age >= LEGAL_DRINKING_AGE;
}

function computeSalesTax(amount: number): number {
  return amount * SALES_TAX_RATE;
}

function estimateDaysFromYears(years: number): number {
  return years * DAYS_PER_YEAR;
}

// ============================================================================
// 3. Obscured intent
// ============================================================================

// Bad: what on earth does this do?
function fn(a: number[]): number {
  return a.reduce((p, c, i) => p + c * (i % 2 === 0 ? 1 : -1), 0);
}

// Good: clear, step by step
function alternatingSum(values: number[]): number {
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    const isEvenIndex = i % 2 === 0;
    const sign = isEvenIndex ? 1 : -1;
    sum += values[i] * sign;
  }
  return sum;
}

// ============================================================================
// 4. Encapsulate conditionals
// ============================================================================

interface Timer {
  hasExpired(): boolean;
  isRecurrent(): boolean;
}

// Bad: raw conditional is hard to understand at a glance
function shouldStopTimerBad(timer: Timer): boolean {
  if (timer.hasExpired() && !timer.isRecurrent()) {
    return true;
  }
  return false;
}

// Good: the conditional is named to express intent
function shouldBeDeleted(timer: Timer): boolean {
  return timer.hasExpired() && !timer.isRecurrent();
}

function processTimerGood(timer: Timer): string {
  if (shouldBeDeleted(timer)) {
    return "Timer deleted";
  }
  return "Timer still active";
}

// ============================================================================
// 5. Negative conditionals
// ============================================================================

interface Buffer {
  shouldNotCompact(): boolean;
  shouldCompact(): boolean;
}

// Bad: double negatives make your brain do extra work
function processBufferBad(buffer: Buffer): string {
  if (!buffer.shouldNotCompact()) {
    return "Compacting buffer";
  }
  return "Skipping compaction";
}

// Good: state the condition positively
function processBufferGood(buffer: Buffer): string {
  if (buffer.shouldCompact()) {
    return "Compacting buffer";
  }
  return "Skipping compaction";
}

// ============================================================================
// 6. Feature envy
// ============================================================================

// Bad: ReportPrinter reaches into ReportData for everything it needs.
// It uses ReportData's internals more than its own state.

class ReportData {
  title: string;
  rows: { label: string; value: number }[];

  constructor(title: string, rows: { label: string; value: number }[]) {
    this.title = title;
    this.rows = rows;
  }
}

class ReportPrinterBad {
  print(data: ReportData): string {
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

// Good: move the formatting logic to where the data lives.
// ReportData knows how to format itself.

class FormattedReport {
  private title: string;
  private rows: { label: string; value: number }[];

  constructor(title: string, rows: { label: string; value: number }[]) {
    this.title = title;
    this.rows = rows;
  }

  getTotal(): number {
    return this.rows.reduce((sum, row) => sum + row.value, 0);
  }

  format(): string {
    const header = `Report: ${this.title}`;
    const separator = "=".repeat(header.length);
    const rowLines = this.rows.map(row => `  ${row.label}: ${row.value}`);
    const totalLine = `  Total: ${this.getTotal()}`;
    return [header, separator, ...rowLines, totalLine].join("\n");
  }
}

// ============================================================================
// Run examples
// ============================================================================

console.log("=== Chapter 17: Smells and Heuristics ===\n");

// 1. Commented-out code
console.log("--- 1. Commented-out code ---");
console.log("Bad (cluttered):", calculateTotalBad([10, 20, 30]));
console.log("Good (clean):  ", calculateTotal([10, 20, 30]));
console.log();

// 2. Magic numbers
console.log("--- 2. Magic numbers ---");
console.log("Bad: canPurchaseAlcoholBad(25) =", canPurchaseAlcoholBad(25));
console.log("Good: canPurchaseAlcohol(25) =", canPurchaseAlcohol(25));
console.log("Bad: computeTaxBad(100) =", computeTaxBad(100));
console.log("Good: computeSalesTax(100) =", computeSalesTax(100));
console.log("Good: estimateDaysFromYears(2) =", estimateDaysFromYears(2));
console.log();

// 3. Obscured intent
console.log("--- 3. Obscured intent ---");
const values = [10, 3, 8, 2, 6];
console.log("Bad:  fn([10, 3, 8, 2, 6]) =", fn(values));
console.log("Good: alternatingSum([10, 3, 8, 2, 6]) =", alternatingSum(values));
console.log();

// 4. Encapsulate conditionals
console.log("--- 4. Encapsulate conditionals ---");
const expiredNonRecurrent: Timer = { hasExpired: () => true, isRecurrent: () => false };
const activeRecurrent: Timer = { hasExpired: () => false, isRecurrent: () => true };
console.log("Bad: shouldStopTimerBad(expired, non-recurrent):", shouldStopTimerBad(expiredNonRecurrent));
console.log("Good: shouldBeDeleted(expired, non-recurrent):", shouldBeDeleted(expiredNonRecurrent));
console.log("Good: processTimerGood(active, recurrent):", processTimerGood(activeRecurrent));
console.log();

// 5. Negative conditionals
console.log("--- 5. Negative conditionals ---");
const compactableBuffer: Buffer = {
  shouldNotCompact: () => false,
  shouldCompact: () => true,
};
console.log("Bad:  processBufferBad:", processBufferBad(compactableBuffer));
console.log("Good: processBufferGood:", processBufferGood(compactableBuffer));
console.log();

// 6. Feature envy
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
