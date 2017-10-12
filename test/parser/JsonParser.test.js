import 'babel-polyfill';
import expect from 'expect.js';

import JsonParser from '../../src/parser/JsonParser';

describe('test json parser', () => {
  it('init class', () => {
    expect(JsonParser).to.ok();
  });
  it('parse normal json string', () => {
    expect(new JsonParser().parse('{"name": "123"}')).to.eql({
      name: '123',
    });
    expect(new JsonParser().parse('{"name": "123", "array": ["123", "456", "789"]}')).to.eql({
      name: '123',
      array: [
        "123",
        "456",
        "789",
      ]
    });
  });
  it('parse wrong json string', () => {
    expect(new JsonParser().parse('{n}')).to.eql(null);
    expect(new JsonParser().parse('{123}')).to.eql(null);
    expect(new JsonParser().parse('{name: "123"}')).to.eql(null);
    expect(new JsonParser().parse('12')).to.eql(null);
    expect(new JsonParser().parse(123456)).to.eql(null);
  });
});
