const assert = require('assert');
const app = require('../../src/app');

describe('\'sqlite\' service', () => {
  it('registered the service', () => {
    const service = app.service('sqlite');

    assert.ok(service, 'Registered the service');
  });
});
