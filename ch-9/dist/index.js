"use strict";
class Stack {
    constructor() {
        this.items = [];
    }
    push(item) {
        this.items.push(item);
    }
    pop() {
        return this.items.pop();
    }
    peek() {
        return this.items[this.items.length - 1];
    }
    isEmpty() {
        return this.items.length === 0;
    }
    size() {
        return this.items.length;
    }
}
class StringCalculator {
    add(input) {
        if (input === "")
            return 0;
        const delimiter = input.includes(",") ? "," : "\n";
        const numbers = input.split(delimiter).map(Number);
        const negatives = numbers.filter((n) => n < 0);
        if (negatives.length > 0) {
            throw new Error(`Negatives not allowed: ${negatives.join(", ")}`);
        }
        return numbers.reduce((sum, n) => sum + n, 0);
    }
}
function test1() {
    const stack = new Stack();
    stack.push(1);
    stack.push(2);
    stack.push(3);
    console.log(stack.size() === 3);
    console.log(stack.peek() === 3);
    console.log(stack.pop() === 3);
    console.log(stack.size() === 2);
    console.log(stack.isEmpty() === false);
    stack.pop();
    stack.pop();
    console.log(stack.isEmpty() === true);
    console.log("test1 done");
}
function shouldReturnCorrectSizeAfterPushingItems() {
    const stack = new Stack();
    stack.push(10);
    stack.push(20);
    stack.push(30);
    console.log("Size after 3 pushes equals 3:", stack.size() === 3);
}
function shouldReturnLastPushedItemOnPeek() {
    const stack = new Stack();
    stack.push(10);
    stack.push(20);
    console.log("Peek returns last pushed item:", stack.peek() === 20);
}
function shouldBeEmptyAfterPoppingAllItems() {
    const stack = new Stack();
    stack.push(10);
    stack.pop();
    console.log("Stack is empty after popping all items:", stack.isEmpty() === true);
}
function test2() {
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
function shouldSumCommaSeparatedNumbers() {
    const calculator = new StringCalculator();
    const input = "1,2,3";
    const result = calculator.add(input);
    console.log("Sum of '1,2,3' equals 6:", result === 6);
}
function shouldReturnZeroForEmptyString() {
    const calculator = new StringCalculator();
    const input = "";
    const result = calculator.add(input);
    console.log("Sum of empty string equals 0:", result === 0);
}
function shouldThrowOnNegativeNumbers() {
    const calculator = new StringCalculator();
    const input = "1,-2,3";
    try {
        calculator.add(input);
        console.log("Should throw on negatives: false (no error thrown)");
    }
    catch (error) {
        const isCorrectError = error instanceof Error && error.message.includes("Negatives not allowed");
        console.log("Should throw on negatives:", isCorrectError);
    }
}
function testA() {
    const stack = new Stack();
    console.log("testA:", stack.isEmpty() === true);
}
function testB() {
    const stack = new Stack();
    stack.push("hello");
    console.log("testB:", stack.pop() === "hello");
}
function testC() {
    const stack = new Stack();
    console.log("testC:", stack.pop() === undefined);
}
function shouldBeEmptyWhenNewlyCreated() {
    const stack = new Stack();
    console.log("New stack is empty:", stack.isEmpty() === true);
}
function shouldReturnPushedItemWhenPopped() {
    const stack = new Stack();
    stack.push("hello");
    console.log("Pop returns pushed item:", stack.pop() === "hello");
}
function shouldReturnUndefinedWhenPoppingEmptyStack() {
    const stack = new Stack();
    console.log("Pop on empty returns undefined:", stack.pop() === undefined);
}
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
