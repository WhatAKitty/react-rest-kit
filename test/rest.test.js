import 'babel-polyfill';
import 'isomorphic-fetch';
import expect from 'expect.js';

import Rest, { Parser } from "../src/rest";

describe('test rest', () => {
  it('test initilize', () => {
    expect(Rest).to.ok();
    const rest = new Rest({
      contentType: 'application/json',
      dataType: 'json',
    });
    expect(rest).to.ok();
  });
  it('test GET method', async () => {
    const rest = new Rest({
      contentType: 'application/json',
      dataType: 'text',
    });
    const res = await rest.GET('http://www.baidu.com', { a: '123' });
    expect(res.data).to.ok();
    expect(res.err).to.be.eql(undefined);
  });
  it('test POST method', async () => {
    const rest = new Rest({
      contentType: 'application/json',
      dataTypeParser: Parser.TextParser,
    });
    const res = await rest.POST('http://www.baidu.com', { a: '123' });
    expect(res.data).to.ok();
    expect(res.err).to.be.eql(undefined);
  });
  it('test PUT method', async () => {
    const rest = new Rest({
      contentType: 'application/json',
      dataTypeParser: Parser.TextParser,
    });
    const res = await rest.PUT('http://www.baidu.com', { a: '123' });
    expect(res.data).to.ok();
    expect(res.err).to.be.eql(undefined);
  });
  it('test GET method with error dataType', async () => {
    expect(() => {
      new Rest({
        contentType: 'application/json',
        dataType: 'error type',
      });
    }).throwError();
  });

  describe('test integrated with fetch mock', async () => {
    const rest = new Rest({
      debug: true,
      mockRequire: require('./_mocks_'),
      mockOptions: {
        delay: 200, // 200ms
        fetch: global.fetch,
        exclude: [
          'http://(.*)',
          'https://(.*)',
        ],
      },
      contentType: 'application/json',
      dataType: 'json',
      exceptionHandler: ({ status, error }) => {
        if (status === 401 || status === 403) {
          const err = new Error('no permission');
          err.response = error.response;
          throw err;
        }
      },
    });

    it('test /api/thing', async () => {
      const { data, err } = await rest.GET('/api/thing');
      expect(err).to.be.an('undefined');
      expect(data).to.be.an('array');
      expect(data).to.not.be.empty();
    });
  });

  describe('test rest exception handler', () => {

    let exceptionHandlerRet;

    const rest = new Rest({
      debug: true,
      mockRequire: require('./_mocks_'),
      mockOptions: {
        delay: 200, // 200ms
        fetch: global.fetch,
        exclude: [
          'http://(.*)',
          'https://(.*)',
        ],
      },
      contentType: 'application/json',
      dataType: 'json',
      exceptionHandler: ({ status, err }) => {
        if (status === 401 || status === 403) {
          exceptionHandlerRet = 'no permission';
        } else {
          exceptionHandlerRet = err.message;
        }
      },
    });

    it('test 401 exception', async () => {
      const { err } = await rest.GET('/api/403');
      expect(err).to.not.be.empty();
      expect(exceptionHandlerRet).to.be.equal('no permission');
    });

    it('test 500 exception', async () => {
      const { err } = await rest.GET('/api/500');
      expect(err).to.not.be.empty();
      expect(err.message).to.be.equal('wrong');
      expect(exceptionHandlerRet).to.be.equal(err.message);
    });

  });

  describe('test get fetch attribute', () => {

    it('test raw fetch', async () => {
      const rest = new Rest({
        contentType: 'application/json',
        dataType: 'json',
      });
      expect(rest.fetch).to.be.an('function');
      expect(rest.fetch === global.fetch).to.be.equal(true);
    });
    it('test fetch mock fetch', async () => {
      const rest = new Rest({
        debug: true,
        mockRequire: require('./_mocks_'),
        mockOptions: {
          delay: 200, // 200ms
          fetch: global.fetch,
          exclude: [
            'http://(.*)',
            'https://(.*)',
          ],
        },
        contentType: 'application/json',
        dataType: 'json',
        exceptionHandler: ({ status, error }) => {
          if (status === 401 || status === 403) {
            throw new Error('no permission');
          }
        },
      });
      expect(rest.fetch).to.be.an('function');
      expect(rest.fetch !== global.fetch).to.be.equal(true);
    });

  });

});
