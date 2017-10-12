import Parser from './Parser';

class JsonParser extends Parser {
  constructor() {
    super();
  }

  // override
  parse(text) {
    try {
      return text;
    } catch (err) {
      return null;
    }
  }
}

export default JsonParser;
