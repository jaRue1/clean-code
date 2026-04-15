"use strict";
function parseArgsV1(args) {
    const result = {};
    let i = 0;
    while (i < args.length) {
        const arg = args[i];
        if (arg.startsWith("-")) {
            const key = arg.replace(/^-+/, "");
            if (i + 1 >= args.length || args[i + 1].startsWith("-")) {
                result[key] = true;
                i++;
            }
            else {
                const val = args[i + 1];
                const num = Number(val);
                if (!isNaN(num) && val !== "") {
                    result[key] = num;
                    i += 2;
                }
                else if (val === "true" || val === "false") {
                    result[key] = val === "true";
                    i += 2;
                }
                else {
                    result[key] = val;
                    i += 2;
                }
            }
        }
        else {
            i++;
        }
    }
    return result;
}
function isFlag(args, index) {
    return index + 1 >= args.length || args[index + 1].startsWith("-");
}
function parseValue(raw) {
    const asNumber = Number(raw);
    if (!isNaN(asNumber) && raw !== "") {
        return asNumber;
    }
    if (raw === "true")
        return true;
    if (raw === "false")
        return false;
    return raw;
}
function stripDashes(arg) {
    return arg.replace(/^-+/, "");
}
function parseArgsV2(args) {
    const result = {};
    let i = 0;
    while (i < args.length) {
        if (!args[i].startsWith("-")) {
            i++;
            continue;
        }
        const key = stripDashes(args[i]);
        if (isFlag(args, i)) {
            result[key] = true;
            i++;
        }
        else {
            result[key] = parseValue(args[i + 1]);
            i += 2;
        }
    }
    return result;
}
class ArgumentParser {
    constructor(programName) {
        this.schema = new Map();
        this.programName = programName;
    }
    addArgument(name, schema) {
        this.schema.set(name, schema);
        return this;
    }
    parse(args) {
        const result = this.initializeDefaults();
        const tokens = this.tokenize(args);
        for (const [key, rawValue] of tokens) {
            this.validateArgumentExists(key);
            result[key] = this.coerceValue(key, rawValue);
        }
        this.validateRequiredArguments(result);
        return result;
    }
    getUsage() {
        const lines = [`Usage: ${this.programName} [options]`, ""];
        for (const [name, schema] of this.schema) {
            const requiredTag = schema.required ? " (required)" : "";
            const defaultTag = schema.defaultValue !== undefined ? ` [default: ${schema.defaultValue}]` : "";
            lines.push(`  --${name}  <${schema.type}>  ${schema.description}${requiredTag}${defaultTag}`);
        }
        return lines.join("\n");
    }
    initializeDefaults() {
        const result = {};
        for (const [name, schema] of this.schema) {
            if (schema.defaultValue !== undefined) {
                result[name] = schema.defaultValue;
            }
        }
        return result;
    }
    tokenize(args) {
        const tokens = [];
        let i = 0;
        while (i < args.length) {
            if (!this.isArgumentFlag(args[i])) {
                i++;
                continue;
            }
            const key = this.extractKey(args[i]);
            const hasValue = i + 1 < args.length && !this.isArgumentFlag(args[i + 1]);
            if (hasValue) {
                tokens.push([key, args[i + 1]]);
                i += 2;
            }
            else {
                tokens.push([key, null]);
                i++;
            }
        }
        return tokens;
    }
    isArgumentFlag(token) {
        return token.startsWith("-");
    }
    extractKey(token) {
        return token.replace(/^-+/, "");
    }
    validateArgumentExists(key) {
        if (!this.schema.has(key)) {
            throw new Error(`Unknown argument: --${key}. Run with --help for usage.`);
        }
    }
    coerceValue(key, rawValue) {
        const schema = this.schema.get(key);
        switch (schema.type) {
            case "boolean":
                return rawValue === null ? true : rawValue === "true";
            case "number":
                return this.parseNumber(key, rawValue);
            case "string":
                return this.parseString(key, rawValue);
        }
    }
    parseNumber(key, rawValue) {
        if (rawValue === null) {
            throw new Error(`Argument --${key} requires a numeric value.`);
        }
        const num = Number(rawValue);
        if (isNaN(num)) {
            throw new Error(`Argument --${key} expected a number but got: "${rawValue}"`);
        }
        return num;
    }
    parseString(key, rawValue) {
        if (rawValue === null) {
            throw new Error(`Argument --${key} requires a string value.`);
        }
        return rawValue;
    }
    validateRequiredArguments(result) {
        for (const [name, schema] of this.schema) {
            if (schema.required && result[name] === undefined) {
                throw new Error(`Missing required argument: --${name}. Run with --help for usage.`);
            }
        }
    }
}
console.log("=== Successive Refinement of an Argument Parser ===\n");
const sampleArgs = ["--name", "Alice", "--verbose", "--port", "8080", "--debug", "false"];
console.log("--- V1: First Draft (messy but works) ---");
const v1Result = parseArgsV1(sampleArgs);
console.log("Input:", sampleArgs.join(" "));
console.log("Parsed:", v1Result);
console.log("\n--- V2: Second Pass (extracted functions) ---");
const v2Result = parseArgsV2(sampleArgs);
console.log("Input:", sampleArgs.join(" "));
console.log("Parsed:", v2Result);
console.log("\n--- V3: Final Version (clean, extensible class) ---");
const parser = new ArgumentParser("my-server")
    .addArgument("name", {
    type: "string",
    description: "The server name",
    required: true,
})
    .addArgument("port", {
    type: "number",
    description: "Port to listen on",
    defaultValue: 3000,
})
    .addArgument("verbose", {
    type: "boolean",
    description: "Enable verbose logging",
    defaultValue: false,
})
    .addArgument("debug", {
    type: "boolean",
    description: "Enable debug mode",
    defaultValue: false,
});
console.log(parser.getUsage());
console.log("");
const v3Result = parser.parse(sampleArgs);
console.log("Input:", sampleArgs.join(" "));
console.log("Parsed:", v3Result);
console.log("\n--- V3: Error Handling ---");
try {
    parser.parse(["--unknown", "value"]);
}
catch (error) {
    if (error instanceof Error) {
        console.log("Caught expected error:", error.message);
    }
}
try {
    parser.parse(["--port", "not-a-number"]);
}
catch (error) {
    if (error instanceof Error) {
        console.log("Caught expected error:", error.message);
    }
}
try {
    parser.parse(["--verbose"]);
}
catch (error) {
    if (error instanceof Error) {
        console.log("Caught expected error:", error.message);
    }
}
