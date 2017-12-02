import querystring from 'querystring';
import { isBlank } from './util';
import { JsonParser, TextParser } from './parser';

class Rest {
  constructor({
    contentType = 'application/json',
    dataType = 'application/json',
    dataTypeParser,
    errorMsgKey = 'message',
    authorizationObain = async () => {},
  }) {
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

  _contentType() {
    return this.contentType;
  }

  _body(data, contentType = this._contentType()) {
    switch(contentType) {
      case 'multipart/form-data':
        const fd = new FormData();
        Object.keys(data).forEach(key => {
          const value = data[key];
          formData.append(key, value);
        });
        return fd;
      case 'application/x-www-form-urlencoded':
        return querystring.stringify(data);
      case 'text/plain':
        return data.toString();
      case 'application/json':
      default:
        return JSON.stringify(data);
    }
  }

  _datatype() {
    return this.dataType;
  }

  _dataTypeParser(dataType = this._datatype()) {
    switch(dataType) {
      case 'json':
        return new JsonParser();
      case 'text':
        return new TextParser();
      default:
        throw new Error(`The dataType named ${dataType} is not supported yet.`);
    }
  }

  _checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    }

    const error = new Error(response.statusText);
    error.response = response;
    throw error;
  }

  _parseError(error, options) {
    try {
      if (!error.response) {
        return Promise.resolve({
          timestamp: new Date().getTime(),
          message: 'unkown error',
          status: -1,
        });
      }
      return error.response.text()
        .then((options.dataTypeParser || this.dataTypeParser).parse)
        .catch(err => {
          return Promise.resolve({
            timestamp: new Date().getTime(),
            message: 'unkown error',
            status: error.response.status,
          });
        })
        .then(err => {
          return {
            ...err,
            message: err[this.errorMsgKey] || 'unkown error',
            timestamp: new Date().getTime(),
            status: err.status,
          };
        });
    } catch (err) {
      return Promise.resolve({
        timestamp: new Date().getTime(),
        message: 'unkown error',
        status: error.response && error.response.status,
      });
    }
  }

  /**
   * request url with options
   * 
   * @param {*} url 
   * @param {*} options 
   */
  _request(url, options) {
    if (this.debug) {
      console.info(`[REST KIT DEBUG]: request: ${url}, options: ${JSON.stringify(options)}`);
    }
    return fetch(url, options)
      .then(this._checkStatus)
      .then(response => response.text())
      .then((options.dataTypeParser || this.dataTypeParser).parse)  // default is this.datatypeParser
      .then((data) => ({ data }))
      .catch((error) => { err: error });
  }

  async rest(url, options = {}) {
    const { data, err } = await this._request(url, {
      ...options,
      headers: {
        'Authorization': await this.authorizationObain(),
        ...options.headers,
      }
    });

    if (!err) {
      if (this.debug) {
        console.info(`[REST KIT DEBUG]: request: ${url} successed, data: `, data);
      }
      return { data };
    }


    const error = await this._parseError(err, options);
    if (this.debug) {
      console.error(`[REST KIT DEBUG]: request: ${url} failed, err: `, error);
    }
    return { err: error };
  }

  async GET(url, params, options = {}) {
    return await this.rest(`${url}${params ? `?${querystring.stringify(params)}` : ''}`, {
      ...options,
      method: 'GET',
      headers: {
        'Content-Type': this._contentType(),
        ...options.headers
      }
    });
  }

  async POST(url, data, options = {}) {
    return await this.rest(url, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': this._contentType(),
        ...options.headers
      },
      body: this._body(data, options.headers && options.headers['Content-Type']),
    });
  }

  async PUT(url, data, options = {}) {
    return await this.rest(url, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': this._contentType(),
        ...options.headers
      },
      body: this._body(data, options.headers && options.headers['Content-Type']),
    });
  }

  async PATCH(url, data, options = {}) {
    return await this.rest(url, {
      ...options,
      method: 'PATCH',
      headers: {
        'Content-Type': this._contentType(),
        ...options.headers
      },
      body: this._body(data, options.headers && options.headers['Content-Type']),
    });
  }

  async DELETE(url, data, options = {}) {
    return await this.rest(url, {
      ...options,
      method: 'DELETE',
      headers: {
        'Content-Type': this._contentType(),
        ...options.headers
      },
      body: this._body(data, options.headers && options.headers['Content-Type']),
    });
  }

  async UPLOAD(url, data) {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      const value = data[key];
      formData.append(key, value);
    });
    return await this.rest(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
  }
}

const Parser = {
  JsonParser,
  TextParser,
};

export {
  Rest as default,
  Parser,
}
