import test from 'ava'
import sinon from 'sinon'
import Command from '@lib/cli'
import Container from '@lib/app/container'

test.afterEach.always(() => {
  sinon.restore()
})

test.serial('CLI initializes the application', async t => {
  const spy = sinon.stub(Container.prototype, 'boot')

  await Command.run()

  t.true(spy.calledOnce, 'Container was not booted')
})
