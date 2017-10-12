import 'babel-polyfill';
import expect from 'expect.js';

import Parser from '../../src/parser/Parser';

describe('test parser', () => {
  it('init class error', () => {
    expect(Parser).to.throwException(exception => {
      expect(exception).to.be.an(TypeError);
    })
  });
  it('execute parse method error', () => {
    expect(() => Parser.parse('1111')).to.throwException(exception => {
      expect(exception).to.be.an(TypeError);
    })
  });
});
