"use strict";
class OrderProcessorBad {
    processOrder(orderId) {
        const taxRate = 0.08;
        const shippingCost = 5.99;
        const discount = 0;
        const orderTotal = 100;
        const tax = orderTotal * taxRate;
        const total = orderTotal + tax + shippingCost - discount;
        console.log(`[BAD LOG] Processing order ${orderId}`);
        return `Order ${orderId}: $${total.toFixed(2)}`;
    }
}
class OrderProcessor {
    constructor(taxCalculator, shippingCalculator, logger) {
        this.taxCalculator = taxCalculator;
        this.shippingCalculator = shippingCalculator;
        this.logger = logger;
    }
    processOrder(orderId, orderTotal) {
        this.logger.log(`Processing order ${orderId}`);
        const tax = this.taxCalculator.calculate(orderTotal);
        const shipping = this.shippingCalculator.calculate(orderId);
        const total = orderTotal + tax + shipping;
        return `Order ${orderId}: $${total.toFixed(2)}`;
    }
}
class StandardTaxCalculator {
    constructor(rate) {
        this.rate = rate;
    }
    calculate(amount) {
        return amount * this.rate;
    }
}
class FlatRateShipping {
    constructor(cost) {
        this.cost = cost;
    }
    calculate(_orderId) {
        return this.cost;
    }
}
class ConsoleLogger {
    log(message) {
        console.log(`[LOG] ${message}`);
    }
}
class NotificationSenderBad {
    send(type, recipient, message) {
        if (type === "email") {
            const subject = "Notification";
            console.log(`[BAD] Sending email to ${recipient}: subject="${subject}", body="${message}"`);
        }
        else if (type === "sms") {
            const truncated = message.substring(0, 160);
            console.log(`[BAD] Sending SMS to ${recipient}: "${truncated}"`);
        }
        else if (type === "push") {
            console.log(`[BAD] Sending push notification to ${recipient}: "${message}"`);
        }
        else {
            throw new Error(`Unknown notification type: ${type}`);
        }
    }
}
class EmailChannel {
    send(recipient, message) {
        console.log(`[Email] To: ${recipient}, Subject: Notification, Body: ${message}`);
    }
}
class SmsChannel {
    send(recipient, message) {
        const truncated = message.substring(0, 160);
        console.log(`[SMS] To: ${recipient}, Message: ${truncated}`);
    }
}
class PushChannel {
    send(recipient, message) {
        console.log(`[Push] To: ${recipient}, Alert: ${message}`);
    }
}
class NotificationFactory {
    constructor() {
        this.channels = new Map();
    }
    register(type, channel) {
        this.channels.set(type, channel);
    }
    create(type) {
        const channel = this.channels.get(type);
        if (!channel) {
            throw new Error(`Unknown notification type: ${type}`);
        }
        return channel;
    }
}
class UserServiceBad {
    getUser(id) {
        const fakeDatabase = {
            "1": "Alice",
            "2": "Bob",
        };
        const name = fakeDatabase[id] || "Unknown";
        console.log(`[BAD] Fetched user ${id} directly from hardcoded data`);
        return { id, name, source: "hardcoded" };
    }
}
class DatabaseUserAccess {
    constructor(initialUsers) {
        this.users = new Map(initialUsers);
    }
    findById(id) {
        const name = this.users.get(id);
        if (!name)
            return undefined;
        return { id, name };
    }
}
class CacheUserAccess {
    constructor(delegate) {
        this.delegate = delegate;
        this.cache = new Map();
    }
    findById(id) {
        if (this.cache.has(id)) {
            console.log(`  Cache hit for user ${id}`);
            return this.cache.get(id);
        }
        console.log(`  Cache miss for user ${id}, delegating to data source`);
        const user = this.delegate.findById(id);
        if (user)
            this.cache.set(id, user);
        return user;
    }
}
class UserService {
    constructor(dataAccess) {
        this.dataAccess = dataAccess;
    }
    getUser(id) {
        return this.dataAccess.findById(id);
    }
    getUserName(id) {
        const user = this.dataAccess.findById(id);
        return user ? user.name : "Unknown";
    }
}
console.log("=== Bad: Class creates its own dependencies ===");
const badProcessor = new OrderProcessorBad();
console.log(badProcessor.processOrder("ORD-001"));
console.log("\n=== Good: Dependencies injected (construction separated from use) ===");
const taxCalc = new StandardTaxCalculator(0.08);
const shipping = new FlatRateShipping(5.99);
const logger = new ConsoleLogger();
const goodProcessor = new OrderProcessor(taxCalc, shipping, logger);
console.log(goodProcessor.processOrder("ORD-001", 100));
console.log("\n=== Bad: Hardcoded object creation (no factory) ===");
const badNotifier = new NotificationSenderBad();
badNotifier.send("email", "user@example.com", "Your order has shipped");
badNotifier.send("sms", "+1234567890", "Your order has shipped");
console.log("\n=== Good: Factory pattern abstracts creation ===");
const factory = new NotificationFactory();
factory.register("email", new EmailChannel());
factory.register("sms", new SmsChannel());
factory.register("push", new PushChannel());
const emailChannel = factory.create("email");
emailChannel.send("user@example.com", "Your order has shipped");
const smsChannel = factory.create("sms");
smsChannel.send("+1234567890", "Your order has shipped");
const pushChannel = factory.create("push");
pushChannel.send("device-token-abc", "Your order has shipped");
console.log("\n=== Bad: Tightly coupled (hardcoded data access) ===");
const badUserService = new UserServiceBad();
console.log(badUserService.getUser("1"));
console.log(badUserService.getUser("3"));
console.log("\n=== Good: Dependency injection (swappable data access) ===");
const dbAccess = new DatabaseUserAccess([
    ["1", "Alice"],
    ["2", "Bob"],
    ["3", "Charlie"],
]);
const cachedAccess = new CacheUserAccess(dbAccess);
const userService = new UserService(cachedAccess);
console.log("First lookup (cache miss):");
console.log(userService.getUser("1"));
console.log("Second lookup (cache hit):");
console.log(userService.getUser("1"));
console.log("Unknown user:");
console.log(userService.getUserName("99"));
