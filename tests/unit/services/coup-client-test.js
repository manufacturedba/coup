import { module, test } from 'qunit';
import { setupTest } from 'coup/tests/helpers';

module('Unit | Service | coup-client', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let service = this.owner.lookup('service:coup-client');
    assert.ok(service);
  });
});
