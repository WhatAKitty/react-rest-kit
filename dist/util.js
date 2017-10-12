'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var isBlank = exports.isBlank = function isBlank(str) {
  if ('undefined' === typeof str || str === null) {
    return true;
  }
  if ('string' !== typeof str) {
    throw new TypeError('not a string type');
  }
  if (str.trim() === '') {
    return true;
  }
  return false;
};