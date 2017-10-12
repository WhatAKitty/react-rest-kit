import 'babel-polyfill';
import expect from 'expect.js';

import { isBlank } from '../src/util';

describe('test util methods', () => {
  it('blank string', () => {
    expect(isBlank('')).to.ok();
    expect(isBlank(null)).to.ok();
    expect(isBlank(undefined)).to.ok();
    expect(isBlank('         ')).to.ok();
    expect(isBlank()).to.ok();
  });
  it('not blank string', () => {
    expect(isBlank('123456')).to.not.ok();
    expect(isBlank('whatakitty')).to.not.ok();
    expect(isBlank('    uiey')).to.not.ok();
  });
  it('not a string type', () => {
    expect(() => isBlank(123456)).to.throwException((exception) => {
      expect(exception).to.be.an(TypeError);
    });
    expect(() => isBlank({})).to.throwException((exception) => {
      expect(exception).to.be.an(TypeError);
    });
    expect(() => isBlank([])).to.throwException((exception) => {
      expect(exception).to.be.an(TypeError);
    });
    expect(() => isBlank({
      name: '123'
    })).to.throwException((exception) => {
      expect(exception).to.be.an(TypeError);
    });
  });
});
