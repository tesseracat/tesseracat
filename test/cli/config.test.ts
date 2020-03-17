import test from 'ava'
import sinon from 'sinon'
import Command from '@lib/cli'
import Config from '@config'
import Container from '@lib/app/container'

test.beforeEach(() => {
  sinon.stub(Container.prototype, 'boot')
})

test.afterEach.always(() => {
  sinon.restore()
})

test.serial('CLI initializes the configuration', async t => {
  const spy = sinon.spy(Config, 'initializeFromOclif')

  await Command.run()

  t.true(spy.calledOnce, 'Config.initializeFromOclif was not called.')
  t.deepEqual(spy.lastCall.args[0], {})
})

test.serial('CLI passes the passed in home dir', async t => {
  const spy = sinon.spy(Config, 'initializeFromOclif')

  await Command.run(['--home', '~/.iotame-new'])

  t.deepEqual(spy.lastCall.args[0], { home: '~/.iotame-new' })
})
