// Successive Refinement
// "It is not enough for code to work. Code that works is often badly written
// and disorganized."

// This file demonstrates the progressive refinement of an argument parser.
// We start with a messy first draft that works, then improve it step by step
// until we arrive at a clean, extensible design.

// ============================================================================
// 1. FIRST DRAFT: messy but working argument parser
// ============================================================================

// Bad - everything crammed into one function, hard to extend, lots of duplication
function parseArgsV1(args: string[]): Record<string, string | boolean | number> {
  const result: Record<string, string | boolean | number> = {}
  let i = 0
  while (i < args.length) {
    const arg = args[i]
    if (arg.startsWith("-")) {
      const key = arg.replace(/^-+/, "")
      // Is it a boolean flag?
      if (i + 1 >= args.length || args[i + 1].startsWith("-")) {
        result[key] = true
        i++
      } else {
        const val = args[i + 1]
        // try to parse as number
        const num = Number(val)
        if (!isNaN(num) && val !== "") {
          result[key] = num
          i += 2
        } else if (val === "true" || val === "false") {
          result[key] = val === "true"
          i += 2
        } else {
          result[key] = val
          i += 2
        }
      }
    } else {
      i++
    }
  }
  return result
}

// ============================================================================
// 2. SECOND PASS: extract functions and clean up the logic
// ============================================================================

// Better - extracted helper functions, but still procedural
function isFlag(args: string[], index: number): boolean {
  return index + 1 >= args.length || args[index + 1].startsWith("-")
}

function parseValue(raw: string): string | boolean | number {
  const asNumber = Number(raw)
  if (!isNaN(asNumber) && raw !== "") {
    return asNumber
  }
  if (raw === "true") return true
  if (raw === "false") return false
  return raw
}

function stripDashes(arg: string): string {
  return arg.replace(/^-+/, "")
}

function parseArgsV2(args: string[]): Record<string, string | boolean | number> {
  const result: Record<string, string | boolean | number> = {}
  let i = 0

  while (i < args.length) {
    if (!args[i].startsWith("-")) {
      i++
      continue
    }

    const key = stripDashes(args[i])

    if (isFlag(args, i)) {
      result[key] = true
      i++
    } else {
      result[key] = parseValue(args[i + 1])
      i += 2
    }
  }

  return result
}

// ============================================================================
// 3. FINAL VERSION: well-structured, extensible argument parser class
// ============================================================================

// Good - clean design with schema validation, typed arguments, and clear structure

type ArgType = "string" | "boolean" | "number"

interface ArgSchema {
  type: ArgType
  description: string
  defaultValue?: string | boolean | number
  required?: boolean
}

interface ParsedArgs {
  [key: string]: string | boolean | number
}

class ArgumentParser {
  private schema: Map<string, ArgSchema> = new Map()
  private programName: string

  constructor(programName: string) {
    this.programName = programName
  }

  addArgument(name: string, schema: ArgSchema): ArgumentParser {
    this.schema.set(name, schema)
    return this
  }

  parse(args: string[]): ParsedArgs {
    const result = this.initializeDefaults()
    const tokens = this.tokenize(args)

    for (const [key, rawValue] of tokens) {
      this.validateArgumentExists(key)
      result[key] = this.coerceValue(key, rawValue)
    }

    this.validateRequiredArguments(result)
    return result
  }

  getUsage(): string {
    const lines: string[] = [`Usage: ${this.programName} [options]`, ""]

    for (const [name, schema] of this.schema) {
      const requiredTag = schema.required ? " (required)" : ""
      const defaultTag =
        schema.defaultValue !== undefined ? ` [default: ${schema.defaultValue}]` : ""
      lines.push(`  --${name}  <${schema.type}>  ${schema.description}${requiredTag}${defaultTag}`)
    }

    return lines.join("\n")
  }

  // --- Private methods: each handles one concern ---

  private initializeDefaults(): ParsedArgs {
    const result: ParsedArgs = {}
    for (const [name, schema] of this.schema) {
      if (schema.defaultValue !== undefined) {
        result[name] = schema.defaultValue
      }
    }
    return result
  }

  private tokenize(args: string[]): Array<[string, string | null]> {
    const tokens: Array<[string, string | null]> = []
    let i = 0

    while (i < args.length) {
      if (!this.isArgumentFlag(args[i])) {
        i++
        continue
      }

      const key = this.extractKey(args[i])
      const hasValue = i + 1 < args.length && !this.isArgumentFlag(args[i + 1])

      if (hasValue) {
        tokens.push([key, args[i + 1]])
        i += 2
      } else {
        tokens.push([key, null])
        i++
      }
    }

    return tokens
  }

  private isArgumentFlag(token: string): boolean {
    return token.startsWith("-")
  }

  private extractKey(token: string): string {
    return token.replace(/^-+/, "")
  }

  private validateArgumentExists(key: string): void {
    if (!this.schema.has(key)) {
      throw new Error(`Unknown argument: --${key}. Run with --help for usage.`)
    }
  }

  private coerceValue(key: string, rawValue: string | null): string | boolean | number {
    const schema = this.schema.get(key)!

    switch (schema.type) {
      case "boolean":
        return rawValue === null ? true : rawValue === "true"
      case "number":
        return this.parseNumber(key, rawValue)
      case "string":
        return this.parseString(key, rawValue)
    }
  }

  private parseNumber(key: string, rawValue: string | null): number {
    if (rawValue === null) {
      throw new Error(`Argument --${key} requires a numeric value.`)
    }
    const num = Number(rawValue)
    if (isNaN(num)) {
      throw new Error(`Argument --${key} expected a number but got: "${rawValue}"`)
    }
    return num
  }

  private parseString(key: string, rawValue: string | null): string {
    if (rawValue === null) {
      throw new Error(`Argument --${key} requires a string value.`)
    }
    return rawValue
  }

  private validateRequiredArguments(result: ParsedArgs): void {
    for (const [name, schema] of this.schema) {
      if (schema.required && result[name] === undefined) {
        throw new Error(
          `Missing required argument: --${name}. Run with --help for usage.`
        )
      }
    }
  }
}

// ============================================================================
// Run examples
// ============================================================================

console.log("=== Successive Refinement of an Argument Parser ===\n")

const sampleArgs = ["--name", "Alice", "--verbose", "--port", "8080", "--debug", "false"]

// Version 1: messy first draft
console.log("--- V1: First Draft (messy but works) ---")
const v1Result = parseArgsV1(sampleArgs)
console.log("Input:", sampleArgs.join(" "))
console.log("Parsed:", v1Result)

// Version 2: extracted helpers
console.log("\n--- V2: Second Pass (extracted functions) ---")
const v2Result = parseArgsV2(sampleArgs)
console.log("Input:", sampleArgs.join(" "))
console.log("Parsed:", v2Result)

// Version 3: fully refined class with schema
console.log("\n--- V3: Final Version (clean, extensible class) ---")
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
  })

console.log(parser.getUsage())
console.log("")

const v3Result = parser.parse(sampleArgs)
console.log("Input:", sampleArgs.join(" "))
console.log("Parsed:", v3Result)

// Demonstrate error handling in the refined version
console.log("\n--- V3: Error Handling ---")
try {
  parser.parse(["--unknown", "value"])
} catch (error) {
  if (error instanceof Error) {
    console.log("Caught expected error:", error.message)
  }
}

try {
  parser.parse(["--port", "not-a-number"])
} catch (error) {
  if (error instanceof Error) {
    console.log("Caught expected error:", error.message)
  }
}

try {
  parser.parse(["--verbose"])
} catch (error) {
  if (error instanceof Error) {
    console.log("Caught expected error:", error.message)
  }
}
