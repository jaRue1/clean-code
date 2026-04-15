// JUnit Internals
// "No module is immune from improvement, and each of us has the responsibility
// to leave the code a little better than we found it."

// ============================================================================
// 1. BEFORE: ComparisonCompactor with unclear names and complex conditionals
// ============================================================================

// This class compares two strings and produces a compact representation
// showing where they differ. It works, but the names are vague and the
// logic is tangled.

class ComparisonCompactor {
  private ctxt: number;
  private s1: string;
  private s2: string;
  private pfx: string = "";
  private sfx: string = "";

  constructor(ctxt: number, s1: string, s2: string) {
    this.ctxt = ctxt;
    this.s1 = s1;
    this.s2 = s2;
  }

  compact(msg: string): string {
    if (this.s1 === null || this.s2 === null || this.s1 === this.s2) {
      return format(msg, this.s1, this.s2);
    }

    this.pfx = "";
    this.sfx = "";

    this.findCommonPfx();
    this.findCommonSfx();

    const exp = this.compactString(this.s1);
    const act = this.compactString(this.s2);

    return format(msg, exp, act);
  }

  private findCommonPfx(): void {
    this.pfx = "";
    const end = Math.min(this.s1.length, this.s2.length);
    for (let i = 0; i < end; i++) {
      if (this.s1.charAt(i) !== this.s2.charAt(i)) break;
      this.pfx += this.s1.charAt(i);
    }
  }

  private findCommonSfx(): void {
    this.sfx = "";
    let j1 = this.s1.length - 1;
    let j2 = this.s2.length - 1;
    while (j1 >= this.pfx.length && j2 >= this.pfx.length) {
      if (this.s1.charAt(j1) !== this.s2.charAt(j2)) break;
      this.sfx = this.s1.charAt(j1) + this.sfx;
      j1--;
      j2--;
    }
  }

  private compactString(s: string): string {
    let result = "[" + s.substring(this.pfx.length, s.length - this.sfx.length) + "]";
    if (this.pfx.length > this.ctxt) {
      result = "..." + this.pfx.substring(this.pfx.length - this.ctxt) + result;
    } else {
      result = this.pfx + result;
    }
    if (this.sfx.length > this.ctxt) {
      result = result + this.sfx.substring(0, this.ctxt) + "...";
    } else {
      result = result + this.sfx;
    }
    return result;
  }
}

function format(msg: string, expected: string, actual: string): string {
  if (msg) {
    return `${msg} expected:<${expected}> but was:<${actual}>`;
  }
  return `expected:<${expected}> but was:<${actual}>`;
}

// ============================================================================
// 2. AFTER: StringDifferenceCompactor with clear names and clean conditionals
// ============================================================================

// Same functionality, but every name tells you what it means, every method
// does one thing, and conditionals are encapsulated.

class StringDifferenceCompactor {
  private contextLength: number;
  private expected: string;
  private actual: string;
  private commonPrefix: string = "";
  private commonSuffix: string = "";

  constructor(contextLength: number, expected: string, actual: string) {
    this.contextLength = contextLength;
    this.expected = expected;
    this.actual = actual;
  }

  formatCompactedComparison(message: string): string {
    if (this.canBeCompacted()) {
      this.findCommonPrefix();
      this.findCommonSuffix();
      const compactExpected = this.buildCompactRepresentation(this.expected);
      const compactActual = this.buildCompactRepresentation(this.actual);
      return this.formatMessage(message, compactExpected, compactActual);
    }
    return this.formatMessage(message, this.expected, this.actual);
  }

  private canBeCompacted(): boolean {
    return this.expected !== null
      && this.actual !== null
      && this.expected !== this.actual;
  }

  private findCommonPrefix(): void {
    this.commonPrefix = "";
    const shortestLength = Math.min(this.expected.length, this.actual.length);
    for (let i = 0; i < shortestLength; i++) {
      if (this.charactersAreDifferentAt(i)) break;
      this.commonPrefix += this.expected.charAt(i);
    }
  }

  private findCommonSuffix(): void {
    this.commonSuffix = "";
    let expectedIndex = this.expected.length - 1;
    let actualIndex = this.actual.length - 1;
    while (this.suffixOverlapsPrefix(expectedIndex, actualIndex)) {
      if (this.expected.charAt(expectedIndex) !== this.actual.charAt(actualIndex)) break;
      this.commonSuffix = this.expected.charAt(expectedIndex) + this.commonSuffix;
      expectedIndex--;
      actualIndex--;
    }
  }

  private charactersAreDifferentAt(index: number): boolean {
    return this.expected.charAt(index) !== this.actual.charAt(index);
  }

  private suffixOverlapsPrefix(expectedIndex: number, actualIndex: number): boolean {
    return expectedIndex >= this.commonPrefix.length && actualIndex >= this.commonPrefix.length;
  }

  private buildCompactRepresentation(source: string): string {
    const difference = this.extractDifference(source);
    const prefix = this.buildPrefix();
    const suffix = this.buildSuffix();
    return `${prefix}[${difference}]${suffix}`;
  }

  private extractDifference(source: string): string {
    return source.substring(
      this.commonPrefix.length,
      source.length - this.commonSuffix.length
    );
  }

  private buildPrefix(): string {
    if (this.prefixExceedsContextLength()) {
      return "..." + this.commonPrefix.substring(this.commonPrefix.length - this.contextLength);
    }
    return this.commonPrefix;
  }

  private buildSuffix(): string {
    if (this.suffixExceedsContextLength()) {
      return this.commonSuffix.substring(0, this.contextLength) + "...";
    }
    return this.commonSuffix;
  }

  private prefixExceedsContextLength(): boolean {
    return this.commonPrefix.length > this.contextLength;
  }

  private suffixExceedsContextLength(): boolean {
    return this.commonSuffix.length > this.contextLength;
  }

  private formatMessage(message: string, expected: string, actual: string): string {
    if (message) {
      return `${message} expected:<${expected}> but was:<${actual}>`;
    }
    return `expected:<${expected}> but was:<${actual}>`;
  }
}

// ============================================================================
// Run examples
// ============================================================================

console.log("=== Chapter 15: JUnit Internals ===\n");

// Test data
const expected = "the quick brown fox jumped over the lazy dog";
const actual = "the quick red fox jumped over the lazy cat";

// BEFORE: Original ComparisonCompactor
console.log("--- BEFORE: ComparisonCompactor (unclear names, complex logic) ---");
const beforeCompactor = new ComparisonCompactor(10, expected, actual);
console.log(beforeCompactor.compact("Strings differ"));
console.log();

// AFTER: Refactored StringDifferenceCompactor
console.log("--- AFTER: StringDifferenceCompactor (clear names, clean conditionals) ---");
const afterCompactor = new StringDifferenceCompactor(10, expected, actual);
console.log(afterCompactor.formatCompactedComparison("Strings differ"));
console.log();

// Additional examples showing context truncation
console.log("--- Context truncation examples ---");
const longPrefix = "abcdefghijklmnopqrstuvwxyz_DIFF1_suffix";
const longPrefixActual = "abcdefghijklmnopqrstuvwxyz_DIFF2_suffix";

const compactorShortCtx = new StringDifferenceCompactor(5, longPrefix, longPrefixActual);
console.log("Short context (5):", compactorShortCtx.formatCompactedComparison(""));

const compactorLongCtx = new StringDifferenceCompactor(50, longPrefix, longPrefixActual);
console.log("Long context (50):", compactorLongCtx.formatCompactedComparison(""));
console.log();

// Equal strings produce no compact output
const equalCompactor = new StringDifferenceCompactor(10, "same", "same");
console.log("Equal strings:", equalCompactor.formatCompactedComparison("Check"));
