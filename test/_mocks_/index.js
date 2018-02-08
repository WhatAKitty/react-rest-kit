import { Mock } from 'react-fetch-mock';

export default {
  '/api/thing': ({ method, url, params, urlparams, headers }) => {
    const all = Mock.mock({
      'list|2': [{
        'id|+1': 1,
        'name': '@first @last',
        'age|18-54': 1,
      }]
    }).list;
    return all;
  },
  '/api/403': () => ({
    status: 403,
  }),
}
