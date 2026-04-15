"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function getUserReportBad(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const userPromise = new Promise((resolve) => {
            setTimeout(() => resolve({ name: "Alice", role: "admin" }), 100);
        });
        const ordersPromise = new Promise((resolve) => {
            setTimeout(() => resolve([100, 200, 300]), 150);
        });
        const [user, orders] = yield Promise.all([userPromise, ordersPromise]);
        const totalSpent = orders.reduce((sum, amount) => sum + amount, 0);
        const status = totalSpent > 500 ? "VIP" : "Regular";
        return `${user.name} (${user.role}) - ${status} - Total: $${totalSpent}`;
    });
}
function classifyCustomer(totalSpent) {
    return totalSpent > 500 ? "VIP" : "Regular";
}
function formatUserReport(user, orders) {
    const totalSpent = orders.reduce((sum, amount) => sum + amount, 0);
    const status = classifyCustomer(totalSpent);
    return `${user.name} (${user.role}) - ${status} - Total: $${totalSpent}`;
}
function fetchUser(_userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => {
            setTimeout(() => resolve({ name: "Alice", role: "admin" }), 100);
        });
    });
}
function fetchOrders(_userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => {
            setTimeout(() => resolve([100, 200, 300]), 150);
        });
    });
}
function getUserReportGood(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const [user, orders] = yield Promise.all([
            fetchUser(userId),
            fetchOrders(userId),
        ]);
        return formatUserReport(user, orders);
    });
}
function processTasksBad(taskNames) {
    return __awaiter(this, void 0, void 0, function* () {
        const results = [];
        const promises = taskNames.map((name) => __awaiter(this, void 0, void 0, function* () {
            const processed = yield new Promise((resolve) => {
                const delay = Math.floor(Math.random() * 50);
                setTimeout(() => resolve(`Done: ${name}`), delay);
            });
            results.push(processed);
        }));
        yield Promise.all(promises);
        return results;
    });
}
function processTasksGood(taskNames) {
    return __awaiter(this, void 0, void 0, function* () {
        const promises = taskNames.map((name) => __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                const delay = Math.floor(Math.random() * 50);
                setTimeout(() => resolve(`Done: ${name}`), delay);
            });
        }));
        return Promise.all(promises);
    });
}
class AsyncQueue {
    constructor() {
        this.queue = [];
        this.waitingConsumers = [];
        this.closed = false;
    }
    produce(item) {
        if (this.closed) {
            throw new Error("Queue is closed");
        }
        if (this.waitingConsumers.length > 0) {
            const consumer = this.waitingConsumers.shift();
            consumer(item);
        }
        else {
            this.queue.push(item);
        }
    }
    consume() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.queue.length > 0) {
                return this.queue.shift();
            }
            if (this.closed) {
                return null;
            }
            return new Promise((resolve) => {
                this.waitingConsumers.push(resolve);
            });
        });
    }
    shutdown() {
        this.closed = true;
        for (const consumer of this.waitingConsumers) {
            consumer(null);
        }
        this.waitingConsumers = [];
    }
}
function runProducerConsumer() {
    return __awaiter(this, void 0, void 0, function* () {
        const queue = new AsyncQueue();
        const consumed = [];
        const producer = () => __awaiter(this, void 0, void 0, function* () {
            const tasks = ["task-1", "task-2", "task-3", "task-4", "task-5"];
            for (const task of tasks) {
                yield new Promise((resolve) => setTimeout(resolve, 20));
                queue.produce(task);
                console.log(`  Produced: ${task}`);
            }
            queue.shutdown();
        });
        const consumer = (consumerId) => __awaiter(this, void 0, void 0, function* () {
            while (true) {
                const item = yield queue.consume();
                if (item === null)
                    break;
                yield new Promise((resolve) => setTimeout(resolve, 30));
                consumed.push(`${consumerId} processed ${item}`);
                console.log(`  ${consumerId} consumed: ${item}`);
            }
        });
        yield Promise.all([
            producer(),
            consumer("Consumer-A"),
            consumer("Consumer-B"),
        ]);
        console.log("  All consumed:", consumed);
    });
}
function incrementCounterBad() {
    return __awaiter(this, void 0, void 0, function* () {
        let counter = 0;
        function unsafeIncrement() {
            return __awaiter(this, void 0, void 0, function* () {
                const current = counter;
                yield new Promise((resolve) => setTimeout(resolve, 1));
                counter = current + 1;
            });
        }
        const operations = Array.from({ length: 10 }, () => unsafeIncrement());
        yield Promise.all(operations);
        return counter;
    });
}
function incrementCounterGood() {
    return __awaiter(this, void 0, void 0, function* () {
        let counter = 0;
        function safeIncrement() {
            return __awaiter(this, void 0, void 0, function* () {
                yield new Promise((resolve) => setTimeout(resolve, 1));
                counter += 1;
            });
        }
        for (let i = 0; i < 10; i++) {
            yield safeIncrement();
        }
        return counter;
    });
}
function incrementCounterWithMerge() {
    return __awaiter(this, void 0, void 0, function* () {
        function computeIncrement() {
            return __awaiter(this, void 0, void 0, function* () {
                yield new Promise((resolve) => setTimeout(resolve, 1));
                return 1;
            });
        }
        const increments = Array.from({ length: 10 }, () => computeIncrement());
        const results = yield Promise.all(increments);
        return results.reduce((sum, val) => sum + val, 0);
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("--- 1. Separate Concurrent Logic ---");
        const badReport = yield getUserReportBad("user-1");
        console.log("Bad (works but tangled):", badReport);
        const goodReport = yield getUserReportGood("user-1");
        console.log("Good (separated):", goodReport);
        console.log("\n--- 2. Limit Shared State ---");
        const badResults = yield processTasksBad(["A", "B", "C", "D"]);
        console.log("Bad (non-deterministic order):", badResults);
        const goodResults = yield processTasksGood(["A", "B", "C", "D"]);
        console.log("Good (deterministic order):", goodResults);
        console.log("\n--- 3. Producer-Consumer Pattern ---");
        yield runProducerConsumer();
        console.log("\n--- 4. Race Conditions ---");
        const badCount = yield incrementCounterBad();
        console.log(`Bad (unsynchronized): expected 10, got ${badCount}`);
        const goodCount = yield incrementCounterGood();
        console.log(`Good (sequential): expected 10, got ${goodCount}`);
        const mergedCount = yield incrementCounterWithMerge();
        console.log(`Good (merge results): expected 10, got ${mergedCount}`);
    });
}
main().catch(console.error);
