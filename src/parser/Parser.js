
class Parser {
  constructor() {
    if (this.constructor === Parser) {
      // Error Type 1. Parser class can not be constructed.
      throw new TypeError('Can not construct abstract class.');
    }
    //else (called from child)
    // Check if all instance methods are implemented.
    if (this.parse === Parser.prototype.parse) {
      // Error Type 4. Child has not implemented this abstract method.
      throw new TypeError('Please implement abstract method parse.');
    }
  }

  parse() {
    throw new TypeError('Do not call abstract method foo from child.');
  }
}

export default Parser;
