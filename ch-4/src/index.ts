// Comments
// "Don't comment bad code; rewrite it."

// ============================================================================
// 1. Redundant Comments
// ============================================================================

// Bad - the comment just restates the code
// Check if the user is an adult
function isAdult(age: number): boolean {
  // return true if age is greater than or equal to 18
  return age >= 18
}

// Good - the function name and code speak for themselves, no comment needed
function isEligibleToVote(age: number): boolean {
  const minimumVotingAge = 18
  return age >= minimumVotingAge
}

// ============================================================================
// 2. Comments That Could Be Functions
// ============================================================================

// Bad - comment explaining what a block of code does
function processEmployees(employees: { name: string; salary: number; department: string }[]) {
  const results: string[] = []

  for (const employee of employees) {
    // Check if employee is eligible for a bonus
    if (employee.salary > 50000 && employee.department === "engineering") {
      // Calculate the bonus amount
      const bonus = employee.salary * 0.1
      // Format the bonus notification
      results.push(`${employee.name}: $${bonus.toFixed(2)} bonus`)
    }
  }

  return results
}

// Good - extract named functions instead of writing comments
function isEligibleForBonus(employee: { salary: number; department: string }): boolean {
  return employee.salary > 50000 && employee.department === "engineering"
}

function calculateBonus(salary: number): number {
  const bonusRate = 0.1
  return salary * bonusRate
}

function formatBonusNotification(name: string, bonus: number): string {
  return `${name}: $${bonus.toFixed(2)} bonus`
}

function getBonusNotifications(employees: { name: string; salary: number; department: string }[]): string[] {
  return employees
    .filter(isEligibleForBonus)
    .map(employee => formatBonusNotification(employee.name, calculateBonus(employee.salary)))
}

// ============================================================================
// 3. Good Comments: Legal, TODO, Warning
// ============================================================================

// Good - legal comment
// Copyright (c) 2024 Clean Code Examples. All rights reserved.
// Licensed under the MIT License.

// Good - TODO comment for future work
function getDiscountRate(customerType: string): number {
  // TODO: Replace with database lookup when customer tier system is implemented
  if (customerType === "premium") return 0.2
  if (customerType === "standard") return 0.1
  return 0
}

// Good - warning of consequences
// WARNING: This function takes approximately 30 seconds to run.
// Do not call in a request-response cycle; use only in background jobs.
function rebuildSearchIndex(documents: string[]): string[] {
  const indexed: string[] = []
  for (const doc of documents) {
    indexed.push(`indexed:${doc}`)
  }
  return indexed
}

// Good - explanation of intent
function compareRankings(a: number, b: number): number {
  // We reverse the sort because lower rank numbers mean higher priority
  return a - b
}

// ============================================================================
// 4. Bad Comments: Journal, Noise, Closing Brace
// ============================================================================

// Bad - journal comments (use source control instead)
// 2024-01-15: Created function
// 2024-02-01: Added validation
// 2024-02-15: Fixed bug with negative numbers
// 2024-03-01: Refactored to use guard clause
function calculateTaxBad(income: number): number {
  if (income <= 0) return 0
  return income * 0.3
}

// Good - no journal; source control tracks the history
function calculateTax(income: number): number {
  if (income <= 0) return 0
  const taxRate = 0.3
  return income * taxRate
}

// Bad - noise comments that add nothing
function getServerPort(): number {
  // define the default port
  const defaultPort = 3000 // the default port is 3000
  // return the default port
  return defaultPort // returns the port
}

// Good - the code is obvious, no comments needed
function getDefaultPort(): number {
  return 3000
}

// Bad - closing brace comments indicate the function is too long
function processAllDataBad(items: string[]): string[] {
  const results: string[] = []
  for (const item of items) {
    if (item.length > 0) {
      if (item.startsWith("valid")) {
        results.push(item.toUpperCase())
      } // end if starts with valid
    } // end if length > 0
  } // end for
  return results
} // end processAllDataBad

// Good - small focused functions eliminate the need for closing brace comments
function isNonEmpty(item: string): boolean {
  return item.length > 0
}

function isValid(item: string): boolean {
  return item.startsWith("valid")
}

function processAllData(items: string[]): string[] {
  return items
    .filter(isNonEmpty)
    .filter(isValid)
    .map(item => item.toUpperCase())
}

// ============================================================================
// Run examples
// ============================================================================

// 1. Redundant comments
console.log("Is 21 eligible to vote:", isEligibleToVote(21))
console.log("Is 16 eligible to vote:", isEligibleToVote(16))

// 2. Comments that could be functions
const employees = [
  { name: "Alice", salary: 75000, department: "engineering" },
  { name: "Bob", salary: 45000, department: "engineering" },
  { name: "Carol", salary: 80000, department: "marketing" },
  { name: "Dave", salary: 60000, department: "engineering" },
]
console.log("Bonus notifications:", getBonusNotifications(employees))

// 3. Good comments
console.log("Premium discount:", getDiscountRate("premium"))
console.log("Search index:", rebuildSearchIndex(["doc1", "doc2", "doc3"]))

// 4. Bad comments eliminated
console.log("Tax on 50000:", calculateTax(50000))
console.log("Default port:", getDefaultPort())
console.log("Processed data:", processAllData(["valid-item", "invalid", "valid-entry", ""]))
