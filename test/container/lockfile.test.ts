import test from 'ava'
import Container from '@lib/app/container'
import Config from '@config'
import sinon from 'sinon'
import mock from 'mock-fs'
import path from 'path'
import fs from 'fs'

class NoProcessError extends Error {
  code = 'ESRCH'
  errno = -3
  syscall = 'kill'
}

test.afterEach.always(() => {
  sinon.restore()
  mock.restore()
})

test.serial('it boots if no pidfile exists', async t => {
  mock({})

  await t.notThrowsAsync(new Container().boot())
})

test.serial('it creates a pidfile for itself', async t => {
  mock({})

  await new Container().boot()

  const pid = process.pid
  const pidfile = fs.readFileSync(path.join(Config.homeDir, 'iotame.pid'), 'utf8')

  t.is(pidfile, String(pid))
})

test.serial('it boots if a pidfile exists and links to a non-running process', async t => {
  const pidPath = path.join(Config.homeDir, 'iotame.pid')
  mock({ [pidPath]: '6345' })

  // Mock the process.kill method to throw (i.e. process does not exist)
  const processMock = sinon.mock(process)
  processMock.expects('kill').withExactArgs(6345, 0).throws(new NoProcessError())

  await new Container().boot()

  // Read the created pidfile, make sure it is now another pid
  const pid = process.pid
  const pidfile = fs.readFileSync(path.join(Config.homeDir, 'iotame.pid'), 'utf8')

  t.is(pidfile, String(pid))
})

test.serial('it raises if a pidfile exists and links to a running process', async t => {
  const pidPath = path.join(Config.homeDir, 'iotame.pid')
  mock({ [pidPath]: '6345' })

  const processMock = sinon.mock(process)
  processMock.expects('kill').withExactArgs(6345, 0).returns(true)

  await t.throwsAsync(new Container().boot())
})
