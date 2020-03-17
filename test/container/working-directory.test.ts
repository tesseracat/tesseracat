import test from 'ava'
import Container from '@lib/app/container'
import Config from '@config'
import mock from 'mock-fs'
import path from 'path'
import fs from 'fs'

test.afterEach.always(() => {
  mock.restore()
})

test.serial('the container changes the working directory upon bootup', async t => {
  const originalCwd = process.cwd()
  const appDir = 'my/path/.iotame'
  mock({ [appDir]: {} })

  Config.homeDir = appDir
  await new Container().boot()

  const targetDir = path.join(originalCwd, appDir)
  t.is(process.cwd(), targetDir)
})

test.serial('it creates the app directory if it did not exist before', async t => {
  const originalCwd = process.cwd()
  const appDir = 'my/other/.iotame'
  mock({}) // Empty file system

  Config.homeDir = appDir
  await new Container().boot()

  const targetDir = path.join(originalCwd, appDir)
  t.true(fs.existsSync(targetDir))
  t.is(process.cwd(), targetDir)
})
