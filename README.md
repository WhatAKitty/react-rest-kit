# react-rest-kit
wrap fetch to RESTful style

# Why react-rest-kit
Flexible wrapper of fetch for RESTful api.

# Usage

* Create a rest client
```js
import Rest from 'react-rest-kit';

const rest = new Rest({
  debug: true,
  mockRequire: require('./_mocks_'),  // api mock files location
  mockOptions: {  // api mock options, go to https://github.com/WhatAKitty/react-native-fetch-mock to find details
    delay: 200, // 200ms
    fetch: global.fetch,
    exclude: [
      'http://(.*)',
      'https://(.*)',
    ],
  },
  contentType: 'application/json',  // the body content type
  dataType: 'json',   // the accept data type
  exceptionHandler: ({ status, err }) => {    // global exceptionHandler
    if (status === 401 || status === 403) {
      dispatch({
        type: 'logout',
      });
    } else {
      notification.error(err.message);
    }
  },
});

export default rest;
```

* Using rest client
```js
import rest from './the/path/to/rest/file';

const testGET = async () => {
  const { data, err } = await rest.GET('url', {
    name: 'whatakitty',
  }, {
    qsStringifyOptions: {
      encodeURIComponent: uri => uri,     // with no encode
    },
  });
};
// => GET `url?name=whatakitty`

const testPOST = async () => {
  const { data, err } = await rest.POST('url', {
    name: 'whatakitty',
    sex: 'boy',
  });
};
// => POST `url` with parameter { name: 'wahtakitty', sex: 'boy' }

const testPUT = async () => {
  const { data, err } = await rest.POST('url', {
    id: '123abc',
    name: 'whatakittyNew',
  });
};
// => PUT `url` with parameter { id: '123abc', name: 'whatakittyNew' }

const testDELETE = async () => {
  const { data, err } = await rest.DELETE('url/123abc');
};
// => DELETE `url/123abc`

const testPATCH = async () => {
  const { data, err } = await rest.PATCH('url/123abc', {
    name: 'whatakittyNew',
  });
};
// => PATCH `url/123abc` with parameter { name: 'whatakittyNew }
```



# Roadmap
- [x] Basic RESTful style
- [x] Global headers setting
- [x] Dev mode(with [React Fetch Mock](https://github.com/WhatAKitty/react-fetch-mock))
- [ ] Refactor code

# LICENSE
MIT
