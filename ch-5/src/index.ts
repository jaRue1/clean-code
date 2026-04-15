// Formatting
// "Code formatting is about communication, and communication is the professional developer's first order of business."

// ============================================================================
// 1. The Newspaper Metaphor
// ============================================================================

// Bad - details first, high-level summary buried at the bottom
function parseDateString(dateStr: string): { year: number; month: number; day: number } {
  const parts = dateStr.split("-")
  const year = parseInt(parts[0], 10)
  const month = parseInt(parts[1], 10)
  const day = parseInt(parts[2], 10)
  return { year, month, day }
}

function isValidYear(year: number): boolean {
  return year >= 1900 && year <= 2100
}

function isValidMonth(month: number): boolean {
  return month >= 1 && month <= 12
}

function isValidDay(day: number): boolean {
  return day >= 1 && day <= 31
}

function validateDateBad(dateStr: string): boolean {
  const parsed = parseDateString(dateStr)
  return isValidYear(parsed.year) && isValidMonth(parsed.month) && isValidDay(parsed.day)
}

// Good - high-level summary at the top, details below (read like a newspaper)
function validateDate(dateStr: string): boolean {
  const date = parseDate(dateStr)
  return isYearInRange(date.year) && isMonthInRange(date.month) && isDayInRange(date.day)
}

function parseDate(dateStr: string): { year: number; month: number; day: number } {
  const [yearStr, monthStr, dayStr] = dateStr.split("-")
  return {
    year: parseInt(yearStr, 10),
    month: parseInt(monthStr, 10),
    day: parseInt(dayStr, 10),
  }
}

function isYearInRange(year: number): boolean {
  return year >= 1900 && year <= 2100
}

function isMonthInRange(month: number): boolean {
  return month >= 1 && month <= 12
}

function isDayInRange(day: number): boolean {
  return day >= 1 && day <= 31
}

// ============================================================================
// 2. Vertical Distance: Related functions should be close together
// ============================================================================

// Bad - the caller and its helpers are far apart with unrelated code in between
function generateReportBad(data: { category: string; amount: number }[]): string {
  const grouped = groupByCategory(data)
  const totals = calculateCategoryTotals(grouped)
  return formatReport(totals)
}

// ... imagine 200 lines of unrelated code here ...

function unrelatedUtilityA(): string {
  return "I don't belong between generateReport and its helpers"
}

function unrelatedUtilityB(): number {
  return 42
}

// ... helpers finally appear far below ...

function groupByCategory(data: { category: string; amount: number }[]): Map<string, number[]> {
  const grouped = new Map<string, number[]>()
  for (const item of data) {
    const existing = grouped.get(item.category) || []
    existing.push(item.amount)
    grouped.set(item.category, existing)
  }
  return grouped
}

function calculateCategoryTotals(grouped: Map<string, number[]>): Map<string, number> {
  const totals = new Map<string, number>()
  grouped.forEach((amounts, category) => {
    totals.set(category, amounts.reduce((sum, val) => sum + val, 0))
  })
  return totals
}

function formatReport(totals: Map<string, number>): string {
  const lines: string[] = []
  totals.forEach((total, category) => {
    lines.push(`${category}: $${total.toFixed(2)}`)
  })
  return lines.join(" | ")
}

// Good - caller directly above its callees, reading top-down
function generateReport(data: { category: string; amount: number }[]): string {
  const grouped = groupDataByCategory(data)
  const totals = sumByCategory(grouped)
  return formatCategoryReport(totals)
}

function groupDataByCategory(data: { category: string; amount: number }[]): Map<string, number[]> {
  const grouped = new Map<string, number[]>()
  for (const item of data) {
    const existing = grouped.get(item.category) || []
    existing.push(item.amount)
    grouped.set(item.category, existing)
  }
  return grouped
}

function sumByCategory(grouped: Map<string, number[]>): Map<string, number> {
  const totals = new Map<string, number>()
  grouped.forEach((amounts, category) => {
    totals.set(category, amounts.reduce((sum, val) => sum + val, 0))
  })
  return totals
}

function formatCategoryReport(totals: Map<string, number>): string {
  const lines: string[] = []
  totals.forEach((total, category) => {
    lines.push(`${category}: $${total.toFixed(2)}`)
  })
  return lines.join(" | ")
}

// ============================================================================
// 3. Horizontal Formatting: Avoid deep nesting, extract functions
// ============================================================================

// Bad - deeply nested logic, hard to follow
function getEligibleUserNamesBad(
  users: { name: string; age: number; active: boolean; roles: string[] }[]
): string[] {
  const result: string[] = []
  for (let i = 0; i < users.length; i++) {
    if (users[i].active) {
      if (users[i].age >= 18) {
        for (let j = 0; j < users[i].roles.length; j++) {
          if (users[i].roles[j] === "admin" || users[i].roles[j] === "editor") {
            result.push(users[i].name)
            break
          }
        }
      }
    }
  }
  return result
}

// Good - flat, extracted functions, each condition has a name
interface AppUser {
  name: string
  age: number
  active: boolean
  roles: string[]
}

function getEligibleUserNames(users: AppUser[]): string[] {
  return users
    .filter(isActiveAdult)
    .filter(hasPrivilegedRole)
    .map(user => user.name)
}

function isActiveAdult(user: AppUser): boolean {
  return user.active && user.age >= 18
}

function hasPrivilegedRole(user: AppUser): boolean {
  const privilegedRoles = ["admin", "editor"]
  return user.roles.some(role => privilegedRoles.indexOf(role) !== -1)
}

// ============================================================================
// Run examples
// ============================================================================

// 1. Newspaper metaphor
console.log("Valid date '2024-06-15':", validateDate("2024-06-15"))
console.log("Valid date '1800-13-45':", validateDate("1800-13-45"))

// 2. Vertical distance
const salesData = [
  { category: "Electronics", amount: 299.99 },
  { category: "Books", amount: 15.99 },
  { category: "Electronics", amount: 149.50 },
  { category: "Books", amount: 24.99 },
  { category: "Clothing", amount: 75.00 },
]
console.log("Report:", generateReport(salesData))

// 3. Horizontal formatting
const users: AppUser[] = [
  { name: "Alice", age: 30, active: true, roles: ["admin", "user"] },
  { name: "Bob", age: 17, active: true, roles: ["admin"] },
  { name: "Carol", age: 25, active: false, roles: ["editor"] },
  { name: "Dave", age: 40, active: true, roles: ["user"] },
  { name: "Eve", age: 28, active: true, roles: ["editor", "user"] },
]
console.log("Eligible users:", getEligibleUserNames(users))
