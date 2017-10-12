'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _JsonParser = require('./JsonParser');

Object.defineProperty(exports, 'JsonParser', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_JsonParser).default;
  }
});

var _TextParser = require('./TextParser');

Object.defineProperty(exports, 'TextParser', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_TextParser).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }