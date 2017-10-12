'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Parser = exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _util = require('./util');

var _parser = require('./parser');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fetch = typeof window !== 'undefined' ? window.fetch : global.fetch ? global.fetch : require('node-fetch');

var Rest = function () {
  function Rest(_ref) {
    var _this = this;

    var _ref$contentType = _ref.contentType,
        contentType = _ref$contentType === undefined ? 'application/json' : _ref$contentType,
        _ref$dataType = _ref.dataType,
        dataType = _ref$dataType === undefined ? 'application/json' : _ref$dataType,
        dataTypeParser = _ref.dataTypeParser,
        _ref$errorMsgKey = _ref.errorMsgKey,
        errorMsgKey = _ref$errorMsgKey === undefined ? 'message' : _ref$errorMsgKey,
        _ref$authorizationOba = _ref.authorizationObain,
        authorizationObain = _ref$authorizationOba === undefined ? _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this);
    })) : _ref$authorizationOba;

    _classCallCheck(this, Rest);

    // contentType should be 'application/json', 'multipart/form-data'
    // , 'application/x-www-form-urlencoded', 'text/plain', default is 'application/json'
    this.contentType = contentType;

    // dataType should be 'application/json', default is 'application/json'
    // Of course, customsized dataType parser is allowed.
    this.dataType = dataType;

    // override default dataTypeParser
    this.dataTypeParser = dataTypeParser ? new dataTypeParser() : this._dataTypeParser();

    this.errorMsgKey = errorMsgKey;

    this.authorizationObain = authorizationObain;

    this._contentType = this._contentType.bind(this);
    this._body = this._body.bind(this);
    this._datatype = this._datatype.bind(this);
    this._dataTypeParser = this._dataTypeParser.bind(this);
    this._checkStatus = this._checkStatus.bind(this);
    this._parseError = this._parseError.bind(this);
    this._request = this._request.bind(this);

    this.rest = this.rest.bind(this);
    this.GET = this.GET.bind(this);
    this.POST = this.POST.bind(this);
    this.PUT = this.PUT.bind(this);
    this.PATCH = this.PATCH.bind(this);
    this.DELETE = this.DELETE.bind(this);
    this.UPLOAD = this.UPLOAD.bind(this);
  }

  _createClass(Rest, [{
    key: '_contentType',
    value: function _contentType() {
      return this.contentType;
    }
  }, {
    key: '_body',
    value: function _body(data) {
      var contentType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this._contentType();

      switch (contentType) {
        case 'multipart/form-data':
          var fd = new FormData();
          Object.keys(data).forEach(function (key) {
            var value = data[key];
            formData.append(key, value);
          });
          return fd;
        case 'application/x-www-form-urlencoded':
          return _querystring2.default.stringify(data);
        case 'text/plain':
          return data.toString();
        case 'application/json':
        default:
          return JSON.stringify(data);
      }
    }
  }, {
    key: '_datatype',
    value: function _datatype() {
      return this.dataType;
    }
  }, {
    key: '_dataTypeParser',
    value: function _dataTypeParser() {
      var dataType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._datatype();

      switch (dataType) {
        case 'json':
          return new _parser.JsonParser();
        case 'text':
          return new _parser.TextParser();
        default:
          throw new Error('The dataType named ' + dataType + ' is not supported yet.');
      }
    }
  }, {
    key: '_checkStatus',
    value: function _checkStatus(response) {
      if (response.status >= 200 && response.status < 300) {
        return response;
      }

      var error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  }, {
    key: '_parseError',
    value: function _parseError(error, options) {
      var _this2 = this;

      try {
        if (!error.response) {
          return Promise.resolve({
            timestamp: new Date().getTime(),
            message: 'unkown error',
            status: -1
          });
        }
        return error.response.text().then((options.dataTypeParser || this.dataTypeParser).parse).catch(function (err) {
          return Promise.resolve({
            timestamp: new Date().getTime(),
            message: 'unkown error',
            status: error.response.status
          });
        }).then(function (err) {
          return _extends({}, err, {
            message: err[_this2.errorMsgKey] || 'unkown error',
            timestamp: new Date().getTime(),
            status: err.status
          });
        });
      } catch (err) {
        return Promise.resolve({
          timestamp: new Date().getTime(),
          message: 'unkown error',
          status: error.response && error.response.status
        });
      }
    }

    /**
     * request url with options
     * 
     * @param {*} url 
     * @param {*} options 
     */

  }, {
    key: '_request',
    value: function _request(url, options) {
      if (this.debug) {
        console.info('[REST KIT DEBUG]: request: ' + url + ', options: ' + JSON.stringify(options));
      }
      return fetch(url, options).then(this._checkStatus).then(function (response) {
        return response.text();
      }).then((options.dataTypeParser || this.dataTypeParser).parse) // default is this.datatypeParser
      .then(function (data) {
        return { data: data };
      }).catch(function (error) {
        err: error;
      });
    }
  }, {
    key: 'rest',
    value: function () {
      var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(url) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var _ref4, data, err, error;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.t0 = this;
                _context2.t1 = url;
                _context2.t2 = _extends;
                _context2.t3 = {};
                _context2.t4 = options;
                _context2.t5 = _extends;
                _context2.next = 8;
                return this.authorizationObain();

              case 8:
                _context2.t6 = _context2.sent;
                _context2.t7 = {
                  'Authorization': _context2.t6
                };
                _context2.t8 = options.headers;
                _context2.t9 = (0, _context2.t5)(_context2.t7, _context2.t8);
                _context2.t10 = {
                  headers: _context2.t9
                };
                _context2.t11 = (0, _context2.t2)(_context2.t3, _context2.t4, _context2.t10);
                _context2.next = 16;
                return _context2.t0._request.call(_context2.t0, _context2.t1, _context2.t11);

              case 16:
                _ref4 = _context2.sent;
                data = _ref4.data;
                err = _ref4.err;

                if (err) {
                  _context2.next = 22;
                  break;
                }

                if (this.debug) {
                  console.info('[REST KIT DEBUG]: request: ' + url + ' successed, data: ', data);
                }
                return _context2.abrupt('return', { data: data });

              case 22:
                _context2.next = 24;
                return this._parseError(err, options);

              case 24:
                error = _context2.sent;

                if (this.debug) {
                  console.error('[REST KIT DEBUG]: request: ' + url + ' failed, err: ', error);
                }
                return _context2.abrupt('return', { err: error });

              case 27:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function rest(_x3) {
        return _ref3.apply(this, arguments);
      }

      return rest;
    }()
  }, {
    key: 'GET',
    value: function () {
      var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(url, params) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.rest('' + url + (params ? '?' + _querystring2.default.stringify(params) : ''), _extends({}, options, {
                  method: 'GET',
                  headers: _extends({
                    'Content-Type': this._contentType()
                  }, options.headers)
                }));

              case 2:
                return _context3.abrupt('return', _context3.sent);

              case 3:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function GET(_x5, _x6) {
        return _ref5.apply(this, arguments);
      }

      return GET;
    }()
  }, {
    key: 'POST',
    value: function () {
      var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(url, data) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this.rest(url, _extends({}, options, {
                  method: 'POST',
                  headers: _extends({
                    'Content-Type': this._contentType()
                  }, options.headers),
                  body: this._body(data, options.headers && options.headers['Content-Type'])
                }));

              case 2:
                return _context4.abrupt('return', _context4.sent);

              case 3:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function POST(_x8, _x9) {
        return _ref6.apply(this, arguments);
      }

      return POST;
    }()
  }, {
    key: 'PUT',
    value: function () {
      var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(url, data) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return this.rest(url, _extends({}, options, {
                  method: 'PUT',
                  headers: _extends({
                    'Content-Type': this._contentType()
                  }, options.headers),
                  body: this._body(data, options.headers && options.headers['Content-Type'])
                }));

              case 2:
                return _context5.abrupt('return', _context5.sent);

              case 3:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function PUT(_x11, _x12) {
        return _ref7.apply(this, arguments);
      }

      return PUT;
    }()
  }, {
    key: 'PATCH',
    value: function () {
      var _ref8 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(url, data) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return this.rest(url, _extends({}, options, {
                  method: 'PATCH',
                  headers: _extends({
                    'Content-Type': this._contentType()
                  }, options.headers),
                  body: this._body(data, options.headers && options.headers['Content-Type'])
                }));

              case 2:
                return _context6.abrupt('return', _context6.sent);

              case 3:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function PATCH(_x14, _x15) {
        return _ref8.apply(this, arguments);
      }

      return PATCH;
    }()
  }, {
    key: 'DELETE',
    value: function () {
      var _ref9 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(url, data) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return this.rest(url, _extends({}, options, {
                  method: 'DELETE',
                  headers: _extends({
                    'Content-Type': this._contentType()
                  }, options.headers),
                  body: this._body(data, options.headers && options.headers['Content-Type'])
                }));

              case 2:
                return _context7.abrupt('return', _context7.sent);

              case 3:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function DELETE(_x17, _x18) {
        return _ref9.apply(this, arguments);
      }

      return DELETE;
    }()
  }, {
    key: 'UPLOAD',
    value: function () {
      var _ref10 = _asyncToGenerator(regeneratorRuntime.mark(function _callee8(url, data) {
        var formData;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                formData = new FormData();

                Object.keys(data).forEach(function (key) {
                  var value = data[key];
                  formData.append(key, value);
                });
                _context8.next = 4;
                return this.rest(url, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'multipart/form-data'
                  },
                  body: formData
                });

              case 4:
                return _context8.abrupt('return', _context8.sent);

              case 5:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function UPLOAD(_x20, _x21) {
        return _ref10.apply(this, arguments);
      }

      return UPLOAD;
    }()
  }]);

  return Rest;
}();

var Parser = {
  JsonParser: _parser.JsonParser,
  TextParser: _parser.TextParser
};

exports.default = Rest;
exports.Parser = Parser;