// Concurrency
// "Objects are abstractions of processing. Threads are abstractions of schedule."

// Note: JavaScript/TypeScript runs on a single thread with an event loop.
// We demonstrate concurrency concepts using async/await and Promises,
// which are the idiomatic way to handle concurrent operations in Node.js.

// ============================================================================
// 1. Separate concurrent logic from business logic (SRP for concurrency)
// ============================================================================

// Bad - async fetching logic is tangled with business logic
async function getUserReportBad(userId: string): Promise<string> {
  // Fetching concern mixed directly into business logic
  const userPromise = new Promise<{ name: string; role: string }>((resolve) => {
    setTimeout(() => resolve({ name: "Alice", role: "admin" }), 100)
  })
  const ordersPromise = new Promise<number[]>((resolve) => {
    setTimeout(() => resolve([100, 200, 300]), 150)
  })

  const [user, orders] = await Promise.all([userPromise, ordersPromise])

  // Business logic mixed in with the async plumbing
  const totalSpent = orders.reduce((sum, amount) => sum + amount, 0)
  const status = totalSpent > 500 ? "VIP" : "Regular"
  return `${user.name} (${user.role}) - ${status} - Total: $${totalSpent}`
}

// Good - async data fetching is separated from business logic
interface User {
  name: string
  role: string
}

// Pure business logic (no async, no concurrency concerns)
function classifyCustomer(totalSpent: number): string {
  return totalSpent > 500 ? "VIP" : "Regular"
}

function formatUserReport(user: User, orders: number[]): string {
  const totalSpent = orders.reduce((sum, amount) => sum + amount, 0)
  const status = classifyCustomer(totalSpent)
  return `${user.name} (${user.role}) - ${status} - Total: $${totalSpent}`
}

// Concurrency layer (only handles async coordination)
async function fetchUser(_userId: string): Promise<User> {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ name: "Alice", role: "admin" }), 100)
  })
}

async function fetchOrders(_userId: string): Promise<number[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve([100, 200, 300]), 150)
  })
}

async function getUserReportGood(userId: string): Promise<string> {
  const [user, orders] = await Promise.all([
    fetchUser(userId),
    fetchOrders(userId),
  ])
  return formatUserReport(user, orders)
}

// ============================================================================
// 2. Limit shared mutable state across async operations
// ============================================================================

// Bad - shared mutable state leads to unpredictable results
async function processTasksBad(taskNames: string[]): Promise<string[]> {
  const results: string[] = [] // shared mutable state

  const promises = taskNames.map(async (name) => {
    const processed = await new Promise<string>((resolve) => {
      const delay = Math.floor(Math.random() * 50)
      setTimeout(() => resolve(`Done: ${name}`), delay)
    })
    results.push(processed) // multiple async ops mutate the same array
  })

  await Promise.all(promises)
  return results // order is non-deterministic
}

// Good - each async operation returns its own result, no shared mutation
async function processTasksGood(taskNames: string[]): Promise<string[]> {
  const promises = taskNames.map(async (name) => {
    return new Promise<string>((resolve) => {
      const delay = Math.floor(Math.random() * 50)
      setTimeout(() => resolve(`Done: ${name}`), delay)
    })
  })

  // Promise.all preserves order regardless of completion order
  return Promise.all(promises)
}

// ============================================================================
// 3. Producer-Consumer pattern with an async queue
// ============================================================================

class AsyncQueue<T> {
  private queue: T[] = []
  private waitingConsumers: Array<(value: T) => void> = []
  private closed = false

  produce(item: T): void {
    if (this.closed) {
      throw new Error("Queue is closed")
    }

    if (this.waitingConsumers.length > 0) {
      const consumer = this.waitingConsumers.shift()!
      consumer(item)
    } else {
      this.queue.push(item)
    }
  }

  async consume(): Promise<T | null> {
    if (this.queue.length > 0) {
      return this.queue.shift()!
    }

    if (this.closed) {
      return null
    }

    return new Promise<T | null>((resolve) => {
      this.waitingConsumers.push(resolve)
    })
  }

  shutdown(): void {
    this.closed = true
    // Resolve all waiting consumers with null to signal completion
    for (const consumer of this.waitingConsumers) {
      consumer(null as unknown as T)
    }
    this.waitingConsumers = []
  }
}

async function runProducerConsumer(): Promise<void> {
  const queue = new AsyncQueue<string>()
  const consumed: string[] = []

  // Producer: generates work items
  const producer = async () => {
    const tasks = ["task-1", "task-2", "task-3", "task-4", "task-5"]
    for (const task of tasks) {
      await new Promise((resolve) => setTimeout(resolve, 20))
      queue.produce(task)
      console.log(`  Produced: ${task}`)
    }
    queue.shutdown()
  }

  // Consumer: processes work items
  const consumer = async (consumerId: string) => {
    while (true) {
      const item = await queue.consume()
      if (item === null) break
      await new Promise((resolve) => setTimeout(resolve, 30))
      consumed.push(`${consumerId} processed ${item}`)
      console.log(`  ${consumerId} consumed: ${item}`)
    }
  }

  // Run producer and two consumers concurrently
  await Promise.all([
    producer(),
    consumer("Consumer-A"),
    consumer("Consumer-B"),
  ])

  console.log("  All consumed:", consumed)
}

// ============================================================================
// 4. Race conditions: unsynchronized counter vs sequential processing
// ============================================================================

// Bad - simulated race condition with shared counter
async function incrementCounterBad(): Promise<number> {
  let counter = 0

  async function unsafeIncrement(): Promise<void> {
    // Simulates a read-modify-write cycle with a gap between read and write
    const current = counter
    await new Promise((resolve) => setTimeout(resolve, 1))
    counter = current + 1 // write back stale value
  }

  // Multiple concurrent increments on shared state
  const operations = Array.from({ length: 10 }, () => unsafeIncrement())
  await Promise.all(operations)

  return counter // likely NOT 10 due to race condition
}

// Good - sequential processing avoids the race condition entirely
async function incrementCounterGood(): Promise<number> {
  let counter = 0

  async function safeIncrement(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1))
    counter += 1
  }

  // Process increments sequentially: no shared-state race
  for (let i = 0; i < 10; i++) {
    await safeIncrement()
  }

  return counter // always 10
}

// Alternative good approach: collect results independently and merge
async function incrementCounterWithMerge(): Promise<number> {
  async function computeIncrement(): Promise<number> {
    await new Promise((resolve) => setTimeout(resolve, 1))
    return 1
  }

  // Each operation produces its own result; no shared mutation
  const increments = Array.from({ length: 10 }, () => computeIncrement())
  const results = await Promise.all(increments)
  return results.reduce((sum, val) => sum + val, 0) // always 10
}

// ============================================================================
// Run examples
// ============================================================================

async function main(): Promise<void> {
  // 1. Separated concurrency
  console.log("--- 1. Separate Concurrent Logic ---")
  const badReport = await getUserReportBad("user-1")
  console.log("Bad (works but tangled):", badReport)
  const goodReport = await getUserReportGood("user-1")
  console.log("Good (separated):", goodReport)

  // 2. Shared state
  console.log("\n--- 2. Limit Shared State ---")
  const badResults = await processTasksBad(["A", "B", "C", "D"])
  console.log("Bad (non-deterministic order):", badResults)
  const goodResults = await processTasksGood(["A", "B", "C", "D"])
  console.log("Good (deterministic order):", goodResults)

  // 3. Producer-Consumer
  console.log("\n--- 3. Producer-Consumer Pattern ---")
  await runProducerConsumer()

  // 4. Race conditions
  console.log("\n--- 4. Race Conditions ---")
  const badCount = await incrementCounterBad()
  console.log(`Bad (unsynchronized): expected 10, got ${badCount}`)
  const goodCount = await incrementCounterGood()
  console.log(`Good (sequential): expected 10, got ${goodCount}`)
  const mergedCount = await incrementCounterWithMerge()
  console.log(`Good (merge results): expected 10, got ${mergedCount}`)
}

main().catch(console.error)
