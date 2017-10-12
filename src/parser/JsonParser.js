import Parser from './Parser';

class JsonParser extends Parser {
  constructor() {
    super();
  }

  // override
  parse(text) {
    try {
      const result = JSON.parse(text);
      if (result && typeof result === 'object') {
        return result;
      }
      return null;
    } catch (err) {
      return null;
    }
  }
}

export default JsonParser;
