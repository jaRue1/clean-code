// Unit Tests
// "Test code is just as important as production code."

// ============================================================================
// Helper classes used in test examples
// ============================================================================

class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }
}

class StringCalculator {
  add(input: string): number {
    if (input === "") return 0;
    const delimiter = input.includes(",") ? "," : "\n";
    const numbers = input.split(delimiter).map(Number);
    const negatives = numbers.filter((n) => n < 0);
    if (negatives.length > 0) {
      throw new Error(`Negatives not allowed: ${negatives.join(", ")}`);
    }
    return numbers.reduce((sum, n) => sum + n, 0);
  }
}

// ============================================================================
// 1. Dirty vs Clean Tests
// ============================================================================

// Bad - test with multiple asserts on different concepts, unclear names
function test1(): void {
  const stack = new Stack<number>();
  stack.push(1);
  stack.push(2);
  stack.push(3);

  // Testing multiple unrelated concepts in a single test
  console.log(stack.size() === 3); // size check
  console.log(stack.peek() === 3); // peek check
  console.log(stack.pop() === 3); // pop returns correct value
  console.log(stack.size() === 2); // size after pop
  console.log(stack.isEmpty() === false); // not empty
  stack.pop();
  stack.pop();
  console.log(stack.isEmpty() === true); // now empty
  console.log("test1 done");
}

// Good - one concept per test, descriptive names
function shouldReturnCorrectSizeAfterPushingItems(): void {
  // Build
  const stack = new Stack<number>();

  // Operate
  stack.push(10);
  stack.push(20);
  stack.push(30);

  // Check
  console.log("Size after 3 pushes equals 3:", stack.size() === 3);
}

function shouldReturnLastPushedItemOnPeek(): void {
  const stack = new Stack<number>();
  stack.push(10);
  stack.push(20);

  console.log("Peek returns last pushed item:", stack.peek() === 20);
}

function shouldBeEmptyAfterPoppingAllItems(): void {
  const stack = new Stack<number>();
  stack.push(10);
  stack.pop();

  console.log("Stack is empty after popping all items:", stack.isEmpty() === true);
}

// ============================================================================
// 2. Build-Operate-Check Pattern
// ============================================================================

// Bad - mixed setup, action, and assertion with no clear separation
function test2(): void {
  const calc = new StringCalculator();
  let result = calc.add("1,2,3");
  console.log(result === 6);
  result = calc.add("");
  console.log(result === 0);
  const calc2 = new StringCalculator();
  result = calc2.add("10,20");
  console.log(result === 30);
  console.log("test2 done");
}

// Good - clearly separated Build, Operate, Check phases
function shouldSumCommaSeparatedNumbers(): void {
  // Build
  const calculator = new StringCalculator();
  const input = "1,2,3";

  // Operate
  const result = calculator.add(input);

  // Check
  console.log("Sum of '1,2,3' equals 6:", result === 6);
}

function shouldReturnZeroForEmptyString(): void {
  // Build
  const calculator = new StringCalculator();
  const input = "";

  // Operate
  const result = calculator.add(input);

  // Check
  console.log("Sum of empty string equals 0:", result === 0);
}

function shouldThrowOnNegativeNumbers(): void {
  // Build
  const calculator = new StringCalculator();
  const input = "1,-2,3";

  // Operate and Check
  try {
    calculator.add(input);
    console.log("Should throw on negatives: false (no error thrown)");
  } catch (error) {
    const isCorrectError =
      error instanceof Error && error.message.includes("Negatives not allowed");
    console.log("Should throw on negatives:", isCorrectError);
  }
}

// ============================================================================
// 3. Test Naming
// ============================================================================

// Bad - meaningless test names
function testA(): void {
  const stack = new Stack<string>();
  console.log("testA:", stack.isEmpty() === true);
}

function testB(): void {
  const stack = new Stack<string>();
  stack.push("hello");
  console.log("testB:", stack.pop() === "hello");
}

function testC(): void {
  const stack = new Stack<string>();
  console.log("testC:", stack.pop() === undefined);
}

// Good - names describe the scenario and expected behavior
function shouldBeEmptyWhenNewlyCreated(): void {
  const stack = new Stack<string>();
  console.log("New stack is empty:", stack.isEmpty() === true);
}

function shouldReturnPushedItemWhenPopped(): void {
  const stack = new Stack<string>();
  stack.push("hello");
  console.log("Pop returns pushed item:", stack.pop() === "hello");
}

function shouldReturnUndefinedWhenPoppingEmptyStack(): void {
  const stack = new Stack<string>();
  console.log("Pop on empty returns undefined:", stack.pop() === undefined);
}

// ============================================================================
// Run examples
// ============================================================================

console.log("=== Bad: Dirty test with mixed concepts (test1) ===");
test1();

console.log("\n=== Good: Clean tests, one concept each ===");
shouldReturnCorrectSizeAfterPushingItems();
shouldReturnLastPushedItemOnPeek();
shouldBeEmptyAfterPoppingAllItems();

console.log("\n=== Bad: Mixed Build-Operate-Check (test2) ===");
test2();

console.log("\n=== Good: Build-Operate-Check pattern ===");
shouldSumCommaSeparatedNumbers();
shouldReturnZeroForEmptyString();
shouldThrowOnNegativeNumbers();

console.log("\n=== Bad: Meaningless test names ===");
testA();
testB();
testC();

console.log("\n=== Good: Descriptive test names ===");
shouldBeEmptyWhenNewlyCreated();
shouldReturnPushedItemWhenPopped();
shouldReturnUndefinedWhenPoppingEmptyStack();
