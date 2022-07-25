// Steps to add ts to a project
//  1. create a folder with two folders within it src && dist
//  2. within the folder run tsc --init
//  3. within the config file specify value for key target to "ES2016" or "es6"
//  4. specify value for rootDir key as "./src"
//  5. specify value for outDir key as "./dist"
//  6. Create index.ts file within src folder and start coding
//  7. When you want to compile just execute the tsc cmd and your js file will appear in the dist folder.

//  execute TypeScript files from the command line
//  execute  ts-node filename

// Meaningful Names

/// Variables with clear context
class GuessStaticMessage {
  number: string
  verb: string
  pluralModifier: string

  constructor() {
    this.number = ""
    this.verb = ""
    this.pluralModifier = ""
  }
  make(candidate: string, count: number): string {
    this.createPluralDependentMessageParts(count)
    return `there %s %s %s%s , ${this.verb}, ${this.number}, ${candidate},${this.pluralModifier}`
  }
  createPluralDependentMessageParts(count: number) {
    if (count == 0) {
      this.thereAreNoLetters()
    } else if (count == 1) {
      this.thereIsOneLetter()
    } else {
      this.thereAreManyLetters(count)
    }
  }
  thereAreManyLetters(count: number) {
    this.number = count.toString()
    this.verb = "are"
    this.pluralModifier = "s"
  }

  thereIsOneLetter() {
    this.number = "1"
    this.verb = "is"
    this.pluralModifier = ""
  }

  thereAreNoLetters() {
    this.number = "no"
    this.verb = "are"
    this.pluralModifier = "s"
  }
}

const randomMessage = new GuessStaticMessage()
const result = randomMessage.make("Rue", 1)
// expected output
//    there %s %s %s%s , is , 1 , Rue,
console.log(result)

// --------------------------------------------------------------------------
/// Variables with unclear context

function printGuessStatistics(candidate: string, count: number): string {
  let number: string
  let verb: string
  let pluralModifier: string

  if (count == 0) {
    number = "no"
    verb = "are"
    pluralModifier = "s"
  } else if (count == 1) {
    number = "1"
    verb = "is"
    pluralModifier = ""
  } else {
    number = count.toString()
    verb = "are"
    pluralModifier = "s"
  }
  let guessMessage = `there %s %s %s%s , ${verb}, ${number}, ${candidate},${pluralModifier}`
  return guessMessage
}
