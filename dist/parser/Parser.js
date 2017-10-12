'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Parser = function () {
  function Parser() {
    _classCallCheck(this, Parser);

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

  _createClass(Parser, [{
    key: 'parse',
    value: function parse() {
      throw new TypeError('Do not call abstract method foo from child.');
    }
  }]);

  return Parser;
}();

exports.default = Parser;