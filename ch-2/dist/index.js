"use strict";
class GuessStaticMessage {
    constructor() {
        this.number = "";
        this.verb = "";
        this.pluralModifier = "";
    }
    make(candidate, count) {
        this.createPluralDependentMessageParts(count);
        return `there %s %s %s%s , ${this.verb}, ${this.number}, ${candidate},${this.pluralModifier}`;
    }
    createPluralDependentMessageParts(count) {
        if (count == 0) {
            this.thereAreNoLetters();
        }
        else if (count == 1) {
            this.thereIsOneLetter();
        }
        else {
            this.thereAreManyLetters(count);
        }
    }
    thereAreManyLetters(count) {
        this.number = count.toString();
        this.verb = "are";
        this.pluralModifier = "s";
    }
    thereIsOneLetter() {
        this.number = "1";
        this.verb = "is";
        this.pluralModifier = "";
    }
    thereAreNoLetters() {
        this.number = "no";
        this.verb = "are";
        this.pluralModifier = "s";
    }
}
const randomMessage = new GuessStaticMessage();
const result = randomMessage.make("Rue", 1);
console.log(result);
function printGuessStatistics(candidate, count) {
    let number;
    let verb;
    let pluralModifier;
    if (count == 0) {
        number = "no";
        verb = "are";
        pluralModifier = "s";
    }
    else if (count == 1) {
        number = "1";
        verb = "is";
        pluralModifier = "";
    }
    else {
        number = count.toString();
        verb = "are";
        pluralModifier = "s";
    }
    let guessMessage = `there %s %s %s%s , ${verb}, ${number}, ${candidate},${pluralModifier}`;
    return guessMessage;
}
