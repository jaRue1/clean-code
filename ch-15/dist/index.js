"use strict";
class ComparisonCompactor {
    constructor(ctxt, s1, s2) {
        this.pfx = "";
        this.sfx = "";
        this.ctxt = ctxt;
        this.s1 = s1;
        this.s2 = s2;
    }
    compact(msg) {
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
    findCommonPfx() {
        this.pfx = "";
        const end = Math.min(this.s1.length, this.s2.length);
        for (let i = 0; i < end; i++) {
            if (this.s1.charAt(i) !== this.s2.charAt(i))
                break;
            this.pfx += this.s1.charAt(i);
        }
    }
    findCommonSfx() {
        this.sfx = "";
        let j1 = this.s1.length - 1;
        let j2 = this.s2.length - 1;
        while (j1 >= this.pfx.length && j2 >= this.pfx.length) {
            if (this.s1.charAt(j1) !== this.s2.charAt(j2))
                break;
            this.sfx = this.s1.charAt(j1) + this.sfx;
            j1--;
            j2--;
        }
    }
    compactString(s) {
        let result = "[" + s.substring(this.pfx.length, s.length - this.sfx.length) + "]";
        if (this.pfx.length > this.ctxt) {
            result = "..." + this.pfx.substring(this.pfx.length - this.ctxt) + result;
        }
        else {
            result = this.pfx + result;
        }
        if (this.sfx.length > this.ctxt) {
            result = result + this.sfx.substring(0, this.ctxt) + "...";
        }
        else {
            result = result + this.sfx;
        }
        return result;
    }
}
function format(msg, expected, actual) {
    if (msg) {
        return `${msg} expected:<${expected}> but was:<${actual}>`;
    }
    return `expected:<${expected}> but was:<${actual}>`;
}
class StringDifferenceCompactor {
    constructor(contextLength, expected, actual) {
        this.commonPrefix = "";
        this.commonSuffix = "";
        this.contextLength = contextLength;
        this.expected = expected;
        this.actual = actual;
    }
    formatCompactedComparison(message) {
        if (this.canBeCompacted()) {
            this.findCommonPrefix();
            this.findCommonSuffix();
            const compactExpected = this.buildCompactRepresentation(this.expected);
            const compactActual = this.buildCompactRepresentation(this.actual);
            return this.formatMessage(message, compactExpected, compactActual);
        }
        return this.formatMessage(message, this.expected, this.actual);
    }
    canBeCompacted() {
        return this.expected !== null
            && this.actual !== null
            && this.expected !== this.actual;
    }
    findCommonPrefix() {
        this.commonPrefix = "";
        const shortestLength = Math.min(this.expected.length, this.actual.length);
        for (let i = 0; i < shortestLength; i++) {
            if (this.charactersAreDifferentAt(i))
                break;
            this.commonPrefix += this.expected.charAt(i);
        }
    }
    findCommonSuffix() {
        this.commonSuffix = "";
        let expectedIndex = this.expected.length - 1;
        let actualIndex = this.actual.length - 1;
        while (this.suffixOverlapsPrefix(expectedIndex, actualIndex)) {
            if (this.expected.charAt(expectedIndex) !== this.actual.charAt(actualIndex))
                break;
            this.commonSuffix = this.expected.charAt(expectedIndex) + this.commonSuffix;
            expectedIndex--;
            actualIndex--;
        }
    }
    charactersAreDifferentAt(index) {
        return this.expected.charAt(index) !== this.actual.charAt(index);
    }
    suffixOverlapsPrefix(expectedIndex, actualIndex) {
        return expectedIndex >= this.commonPrefix.length && actualIndex >= this.commonPrefix.length;
    }
    buildCompactRepresentation(source) {
        const difference = this.extractDifference(source);
        const prefix = this.buildPrefix();
        const suffix = this.buildSuffix();
        return `${prefix}[${difference}]${suffix}`;
    }
    extractDifference(source) {
        return source.substring(this.commonPrefix.length, source.length - this.commonSuffix.length);
    }
    buildPrefix() {
        if (this.prefixExceedsContextLength()) {
            return "..." + this.commonPrefix.substring(this.commonPrefix.length - this.contextLength);
        }
        return this.commonPrefix;
    }
    buildSuffix() {
        if (this.suffixExceedsContextLength()) {
            return this.commonSuffix.substring(0, this.contextLength) + "...";
        }
        return this.commonSuffix;
    }
    prefixExceedsContextLength() {
        return this.commonPrefix.length > this.contextLength;
    }
    suffixExceedsContextLength() {
        return this.commonSuffix.length > this.contextLength;
    }
    formatMessage(message, expected, actual) {
        if (message) {
            return `${message} expected:<${expected}> but was:<${actual}>`;
        }
        return `expected:<${expected}> but was:<${actual}>`;
    }
}
console.log("=== Chapter 15: JUnit Internals ===\n");
const expected = "the quick brown fox jumped over the lazy dog";
const actual = "the quick red fox jumped over the lazy cat";
console.log("--- BEFORE: ComparisonCompactor (unclear names, complex logic) ---");
const beforeCompactor = new ComparisonCompactor(10, expected, actual);
console.log(beforeCompactor.compact("Strings differ"));
console.log();
console.log("--- AFTER: StringDifferenceCompactor (clear names, clean conditionals) ---");
const afterCompactor = new StringDifferenceCompactor(10, expected, actual);
console.log(afterCompactor.formatCompactedComparison("Strings differ"));
console.log();
console.log("--- Context truncation examples ---");
const longPrefix = "abcdefghijklmnopqrstuvwxyz_DIFF1_suffix";
const longPrefixActual = "abcdefghijklmnopqrstuvwxyz_DIFF2_suffix";
const compactorShortCtx = new StringDifferenceCompactor(5, longPrefix, longPrefixActual);
console.log("Short context (5):", compactorShortCtx.formatCompactedComparison(""));
const compactorLongCtx = new StringDifferenceCompactor(50, longPrefix, longPrefixActual);
console.log("Long context (50):", compactorLongCtx.formatCompactedComparison(""));
console.log();
const equalCompactor = new StringDifferenceCompactor(10, "same", "same");
console.log("Equal strings:", equalCompactor.formatCompactedComparison("Check"));
