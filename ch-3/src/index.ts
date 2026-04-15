// Functions
// "They are the first line of organization in any program"

// ============================================================================
// 1. Functions should be small & do ONE thing
// ============================================================================

// Bad - this function does too many things: validates, calculates, formats
function processOrder(items: { name: string; price: number; qty: number }[]) {
  let total = 0
  for (const item of items) {
    if (item.price < 0 || item.qty < 0) {
      console.log("Invalid item: " + item.name)
      continue
    }
    total += item.price * item.qty
  }
  const tax = total * 0.08
  const finalTotal = total + tax
  return `Order Total: $${total.toFixed(2)} + Tax: $${tax.toFixed(2)} = $${finalTotal.toFixed(2)}`
}

// Good - each function does one thing
function calculateSubtotal(items: { name: string; price: number; qty: number }[]): number {
  return items.reduce((sum, item) => sum + item.price * item.qty, 0)
}

function calculateTax(subtotal: number): number {
  return subtotal * 0.08
}

function formatOrderSummary(subtotal: number, tax: number): string {
  const total = subtotal + tax
  return `Order Total: $${subtotal.toFixed(2)} + Tax: $${tax.toFixed(2)} = $${total.toFixed(2)}`
}

// ============================================================================
// 2. Mixing levels of abstraction is confusing
// ============================================================================

// Bad - high-level logic mixed with low-level details
function renderUserProfile(userId: string) {
  const headers = { "Content-Type": "application/json", Authorization: "Bearer token123" }
  const response = fetch(`https://api.example.com/users/${userId}`, { headers })
  // suddenly high-level
  // validateUser(response)
  // then back to low-level
  const html = `<div class="profile"><h1>${userId}</h1></div>`
  return html
}

// Good - each function stays at one level of abstraction
function renderProfile(userId: string) {
  const user = fetchUser(userId)
  const validatedUser = validateUser(user)
  return buildProfileHtml(validatedUser)
}

function fetchUser(userId: string) {
  return { id: userId, name: "Rue" }
}

function validateUser(user: { id: string; name: string }) {
  if (!user.id || !user.name) throw new Error("Invalid user")
  return user
}

function buildProfileHtml(user: { id: string; name: string }): string {
  return `<div class="profile"><h1>${user.name}</h1></div>`
}

// ============================================================================
// 3. Function arity: niladic, monadic, dyadic, triadic
// ============================================================================

// niladic - zero arguments (ideal)
function getCurrentTimestamp(): number {
  return Date.now()
}

// monadic - one argument (good)
function isValid(email: string): boolean {
  return email.includes("@")
}

// dyadic - two arguments (acceptable)
function createPoint(x: number, y: number): { x: number; y: number } {
  return { x, y }
}

// triadic - three arguments (avoid when possible)
// Bad - hard to remember argument order
function createUser(name: string, email: string, role: string) {
  return { name, email, role }
}

// ============================================================================
// 4. Reducing arguments by creating objects is not cheating
// ============================================================================

// Bad - too many arguments, easy to mix up order
function sendNotification(
  to: string,
  from: string,
  subject: string,
  body: string,
  isUrgent: boolean
) {
  return { to, from, subject, body, isUrgent }
}

// Good - group related arguments into an object
interface NotificationConfig {
  to: string
  from: string
  subject: string
  body: string
  isUrgent: boolean
}

function sendNotificationClean(config: NotificationConfig) {
  return config
}

// calling code is much more readable
const notification = sendNotificationClean({
  to: "user@email.com",
  from: "admin@email.com",
  subject: "Welcome",
  body: "Hello!",
  isUrgent: false,
})

// ============================================================================
// 5. Passing a boolean into a function is terrible practice
// ============================================================================

// Bad - boolean flag means the function does more than one thing
function getUsers(includeInactive: boolean) {
  if (includeInactive) {
    return ["active1", "active2", "inactive1"]
  }
  return ["active1", "active2"]
}

// Good - separate functions with clear names
function getActiveUsers(): string[] {
  return ["active1", "active2"]
}

function getAllUsers(): string[] {
  return ["active1", "active2", "inactive1"]
}

// ============================================================================
// 6. Error handling is one thing
// ============================================================================

// Bad - error handling mixed with business logic
function divide(a: number, b: number): string {
  if (typeof a !== "number" || typeof b !== "number") {
    console.error("Invalid input")
    return "Error"
  }
  if (b === 0) {
    console.error("Cannot divide by zero")
    return "Error"
  }
  const result = a / b
  if (!isFinite(result)) {
    console.error("Result is not finite")
    return "Error"
  }
  return result.toFixed(2)
}

// Good - separate error handling from logic
function safeDivide(a: number, b: number): number {
  try {
    return performDivision(a, b)
  } catch (error) {
    handleMathError(error)
    return 0
  }
}

function performDivision(a: number, b: number): number {
  if (b === 0) throw new Error("Cannot divide by zero")
  return a / b
}

function handleMathError(error: unknown): void {
  if (error instanceof Error) {
    console.error(`Math error: ${error.message}`)
  }
}

// ============================================================================
// 7. Duplication is the root of all evil
// ============================================================================

// Bad - duplicated validation logic
function createAdmin(name: string, email: string) {
  if (!name || name.length < 2) throw new Error("Invalid name")
  if (!email || !email.includes("@")) throw new Error("Invalid email")
  return { name, email, role: "admin" }
}

function createEditor(name: string, email: string) {
  if (!name || name.length < 2) throw new Error("Invalid name")
  if (!email || !email.includes("@")) throw new Error("Invalid email")
  return { name, email, role: "editor" }
}

// Good - extract the shared logic
function validateInput(name: string, email: string): void {
  if (!name || name.length < 2) throw new Error("Invalid name")
  if (!email || !email.includes("@")) throw new Error("Invalid email")
}

function createMember(name: string, email: string, role: string) {
  validateInput(name, email)
  return { name, email, role }
}

// ============================================================================
// Run examples
// ============================================================================

// 1. Small functions
const items = [
  { name: "Book", price: 15.99, qty: 2 },
  { name: "Pen", price: 1.5, qty: 5 },
]
const subtotal = calculateSubtotal(items)
const tax = calculateTax(subtotal)
console.log(formatOrderSummary(subtotal, tax))

// 3. Arity
console.log("Timestamp:", getCurrentTimestamp())
console.log("Valid email:", isValid("rue@email.com"))
console.log("Point:", createPoint(10, 20))

// 5. No boolean flags
console.log("Active users:", getActiveUsers())
console.log("All users:", getAllUsers())

// 6. Error handling
console.log("10 / 3 =", safeDivide(10, 3))
console.log("10 / 0 =", safeDivide(10, 0))

// 7. No duplication
console.log(createMember("Rue", "rue@email.com", "admin"))
console.log(createMember("Jay", "jay@email.com", "editor"))
