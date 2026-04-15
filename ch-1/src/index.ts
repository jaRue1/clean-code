// Clean Code
// "Clean code reads like well-written prose."

// ============================================================================
// 1. Meaningful over Clever
// ============================================================================

// Bad - clever one-liner that is hard to read
function gD(a: number[]): number[] {
  return a.filter((v, i, s) => s.indexOf(v) === i).sort((a, b) => a - b)
}

// Good - readable steps with clear intent
function getUniqueSortedNumbers(numbers: number[]): number[] {
  const uniqueNumbers = removeDuplicates(numbers)
  const sortedNumbers = sortAscending(uniqueNumbers)
  return sortedNumbers
}

function removeDuplicates(numbers: number[]): number[] {
  return [...new Set(numbers)]
}

function sortAscending(numbers: number[]): number[] {
  return [...numbers].sort((a, b) => a - b)
}

// ============================================================================
// 2. The Boy Scout Rule: Leave it cleaner than you found it
// ============================================================================

// Bad - messy code left as-is, adding more mess on top
function getUserData(id: number) {
  // TODO: fix this later
  const d: any = { n: "Rue", e: "rue@email.com", a: 25 }
  const x = d.n + " " + d.e
  // added this quick fix for the age thing
  const ag = d.a
  return { x, ag, raw: d }
}

// Good - small improvements made while working in the area
interface User {
  name: string
  email: string
  age: number
}

function getUser(id: number): User {
  const user: User = { name: "Rue", email: "rue@email.com", age: 25 }
  return user
}

function formatUserSummary(user: User): string {
  return `${user.name} (${user.email})`
}

// ============================================================================
// 3. Code that reads like prose
// ============================================================================

// Bad - cryptic names, unclear intent
function proc(d: string[], f: number): string[] {
  const r: string[] = []
  for (let i = 0; i < d.length; i++) {
    if (d[i].length > f) {
      r.push(d[i].toUpperCase())
    }
  }
  return r
}

// Good - reads like a sentence: "filter words longer than minimum length, then capitalize them"
function getCapitalizedLongWords(words: string[], minimumLength: number): string[] {
  const longWords = words.filter(word => isLongerThan(word, minimumLength))
  const capitalizedWords = longWords.map(word => capitalize(word))
  return capitalizedWords
}

function isLongerThan(word: string, minimumLength: number): boolean {
  return word.length > minimumLength
}

function capitalize(word: string): string {
  return word.toUpperCase()
}

// ============================================================================
// Run examples
// ============================================================================

// 1. Meaningful over clever
const rawNumbers = [5, 3, 8, 3, 1, 8, 2, 5]
console.log("Unique sorted numbers:", getUniqueSortedNumbers(rawNumbers))

// 2. Boy Scout Rule
const user = getUser(1)
console.log("User summary:", formatUserSummary(user))
console.log("User details:", user)

// 3. Code that reads like prose
const sampleWords = ["hi", "clean", "code", "readability", "go", "prose"]
console.log("Capitalized long words:", getCapitalizedLongWords(sampleWords, 3))
