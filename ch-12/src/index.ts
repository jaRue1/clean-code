// Emergence
// "Following the practice of simple design can encourage and enable developers
// to adhere to good principles and patterns."

// ============================================================================
// 1. Expressiveness: intent-revealing names and clear code
// ============================================================================

// Bad - cryptic variable and function names hide intent
function calc(d: { n: string; a: number; s: number[] }[]): number {
  let r = 0
  for (let i = 0; i < d.length; i++) {
    let t = 0
    for (let j = 0; j < d[i].s.length; j++) {
      t += d[i].s[j]
    }
    r += t / d[i].s.length >= 70 ? 1 : 0
  }
  return r
}

// Good - expressive names reveal what the code actually does
interface Student {
  name: string
  age: number
  scores: number[]
}

function calculateAverageScore(scores: number[]): number {
  const total = scores.reduce((sum, score) => sum + score, 0)
  return total / scores.length
}

function isPassingStudent(student: Student): boolean {
  const passingThreshold = 70
  const averageScore = calculateAverageScore(student.scores)
  return averageScore >= passingThreshold
}

function countPassingStudents(students: Student[]): number {
  return students.filter(isPassingStudent).length
}

// ============================================================================
// 2. No duplication: extract repeated patterns into shared abstractions
// ============================================================================

// Bad - duplicated template logic across report generators
function generateSalesReport(data: { month: string; revenue: number }[]): string {
  // Header
  let report = "=== SALES REPORT ===\n"
  report += `Generated: ${new Date().toLocaleDateString()}\n`
  report += "--------------------\n"
  // Body (unique per report)
  for (const entry of data) {
    report += `${entry.month}: $${entry.revenue.toFixed(2)}\n`
  }
  // Footer
  report += "--------------------\n"
  const total = data.reduce((sum, entry) => sum + entry.revenue, 0)
  report += `Total: $${total.toFixed(2)}\n`
  report += "=== END REPORT ===\n"
  return report
}

function generateInventoryReport(data: { item: string; quantity: number }[]): string {
  // Header (duplicated)
  let report = "=== INVENTORY REPORT ===\n"
  report += `Generated: ${new Date().toLocaleDateString()}\n`
  report += "--------------------\n"
  // Body (unique per report)
  for (const entry of data) {
    report += `${entry.item}: ${entry.quantity} units\n`
  }
  // Footer (duplicated)
  report += "--------------------\n"
  const total = data.reduce((sum, entry) => sum + entry.quantity, 0)
  report += `Total: ${total} units\n`
  report += "=== END REPORT ===\n"
  return report
}

// Good - extract the template method to eliminate duplication
function generateReport(
  title: string,
  formatBody: () => string[],
  formatTotal: () => string
): string {
  const lines: string[] = []
  lines.push(`=== ${title} ===`)
  lines.push(`Generated: ${new Date().toLocaleDateString()}`)
  lines.push("--------------------")
  lines.push(...formatBody())
  lines.push("--------------------")
  lines.push(formatTotal())
  lines.push("=== END REPORT ===")
  return lines.join("\n") + "\n"
}

function buildSalesReport(data: { month: string; revenue: number }[]): string {
  return generateReport(
    "SALES REPORT",
    () => data.map((entry) => `${entry.month}: $${entry.revenue.toFixed(2)}`),
    () => {
      const total = data.reduce((sum, entry) => sum + entry.revenue, 0)
      return `Total: $${total.toFixed(2)}`
    }
  )
}

function buildInventoryReport(data: { item: string; quantity: number }[]): string {
  return generateReport(
    "INVENTORY REPORT",
    () => data.map((entry) => `${entry.item}: ${entry.quantity} units`),
    () => {
      const total = data.reduce((sum, entry) => sum + entry.quantity, 0)
      return `Total: ${total} units`
    }
  )
}

// ============================================================================
// 3. Minimal design: simplest thing that works, no unnecessary abstractions
// ============================================================================

// Bad - over-engineered with unnecessary layers for a simple task
interface IStringFormatter {
  format(input: string): string
}

interface IStringFormatterFactory {
  createFormatter(type: string): IStringFormatter
}

class UpperCaseFormatter implements IStringFormatter {
  format(input: string): string {
    return input.toUpperCase()
  }
}

class LowerCaseFormatter implements IStringFormatter {
  format(input: string): string {
    return input.toLowerCase()
  }
}

class TitleCaseFormatter implements IStringFormatter {
  format(input: string): string {
    return input
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
  }
}

class StringFormatterFactory implements IStringFormatterFactory {
  createFormatter(type: string): IStringFormatter {
    switch (type) {
      case "upper":
        return new UpperCaseFormatter()
      case "lower":
        return new LowerCaseFormatter()
      case "title":
        return new TitleCaseFormatter()
      default:
        throw new Error(`Unknown formatter type: ${type}`)
    }
  }
}

// Usage of over-engineered version
const factory = new StringFormatterFactory()
const formatter = factory.createFormatter("title")
const _overEngineeredResult = formatter.format("hello world")

// Good - the simplest thing that works
function formatString(input: string, style: "upper" | "lower" | "title"): string {
  switch (style) {
    case "upper":
      return input.toUpperCase()
    case "lower":
      return input.toLowerCase()
    case "title":
      return input
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ")
  }
}

// ============================================================================
// Run examples
// ============================================================================

// 1. Expressiveness
const students: Student[] = [
  { name: "Alice", age: 20, scores: [85, 92, 78] },
  { name: "Bob", age: 22, scores: [55, 60, 65] },
  { name: "Carol", age: 21, scores: [90, 88, 95] },
]

// Bad version: what does calc do? What are n, a, s, r, t?
const crypticResult = calc(
  students.map((s) => ({ n: s.name, a: s.age, s: s.scores }))
)
console.log("Cryptic calc result:", crypticResult)

// Good version: clear and self-documenting
const passingCount = countPassingStudents(students)
console.log("Passing students:", passingCount)

// 2. No duplication
const salesData = [
  { month: "January", revenue: 15000 },
  { month: "February", revenue: 18500 },
]
const inventoryData = [
  { item: "Widgets", quantity: 150 },
  { item: "Gadgets", quantity: 75 },
]
console.log("\n--- Extracted Template Method ---")
console.log(buildSalesReport(salesData))
console.log(buildInventoryReport(inventoryData))

// 3. Minimal design
console.log("--- Minimal Design ---")
console.log(formatString("hello world", "title"))
console.log(formatString("hello world", "upper"))
console.log(formatString("HELLO WORLD", "lower"))
