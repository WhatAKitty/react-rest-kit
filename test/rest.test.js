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
    const res = await rest.GET('http://www.baidu.com', {a: '123'});
    expect(res.data).to.ok();
    expect(res.err).to.be.eql(undefined);
  });
  it('test POST method', async () => {
    const rest = new Rest({
      contentType: 'application/json',
      dataTypeParser: Parser.TextParser,
    });
    const res = await rest.POST('http://www.baidu.com', {a: '123'});
    expect(res.data).to.ok();
    expect(res.err).to.be.eql(undefined);
  });
  it('test PUT method', async () => {
    const rest = new Rest({
      contentType: 'application/json',
      dataTypeParser: Parser.TextParser,
    });
    const res = await rest.PUT('http://www.baidu.com', {a: '123'});
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
  it('test qidian', async () => {
    const rest = new Rest({
      contentType: 'application/json',
      dataType: 'json',
    });
    const { data, err } = await rest.GET('https://mage.if.qidian.com/Atom.axd/Api/Book/Get', {
      BookId: 1003759751,
      iosDeviceType: 0,
      isOutBook: 0,
      preview: 0,
    }, {
      headers: {
        'qdheader': 'OGZmOTAyZTBjNWM2MzNhMjYzNzQ4MjI5ZWRkMzBiOWF8NC43LjB8NzUwfDEzMzR8QXBwU3RvcmV8MTAuMzB8NXxpT1MvaVBob25lL2lQaG9uZTgsMXwxOTl8QXBwU3RvcmV8M3wtOTk5fDE1MDczNDc4MzI0MjF8MHwxYWUxM2Q4Mi1jMTBkLTQ1MGItYTNlOC1jODJjZTE1YjliOGM=',
      }
    });
  })
});
