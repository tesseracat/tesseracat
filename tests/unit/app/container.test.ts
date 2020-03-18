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

describe('Application Container', () => {
  afterEach(() => {
    sinon.restore()
    mock.restore()
  })

  describe('.boot()', () => {
    const cwd = process.cwd()

    beforeEach(() => {
      Config.homeDir = 'my/path/.iotame'
      mock({ [Config.homeDir]: {} })
    })

    describe('working directory change', () => {
      it('changes the working directory upon bootup', async () => {
        await new Container().boot()

        const targetDir = path.join(cwd, Config.homeDir)
        process.cwd().should.equal(targetDir)
      })

      it('creates the app directory if it did not exist before', async () => {
        // Re-create an empty file system
        mock({})
        const targetDir = path.join(cwd, Config.homeDir)

        await new Container().boot()

        fs.existsSync(targetDir).should.be.true
        process.cwd().should.equal(targetDir)
      })
    })

    describe('pidfile', () => {
      it('boots if no pidfile exists', async () => {
        const container = new Container()
        return container.boot().should.not.be.rejected
      })

      it('creates a pidfile for itself', async () => {
        await new Container().boot()

        const pid = process.pid
        const pidfile = fs.readFileSync(path.join(cwd, Config.homeDir, 'iotame.pid'), 'utf8')

        pidfile.should.equal(String(pid))
      })

      it('boots if a pidfile exists and links to a non-running process', async () => {
        const pidPath = path.join(Config.homeDir, 'iotame.pid')
        mock({ [pidPath]: '6345' })

        await new Container().boot()

        // Mock the process.kill method to throw (i.e. process does not exist)
        const processMock = sinon.mock(process)
        processMock.expects('kill').withExactArgs(6345, 0).throws(new NoProcessError())

        // Read the created pidfile, make sure it is now another pid
        const pid = process.pid
        const pidfile = fs.readFileSync(path.join(Config.homeDir, 'iotame.pid'), 'utf8')

        pidfile.should.equal(String(pid))
      })

      it('it raises if a pidfile exists and links to a running process', async () => {
        const pidPath = path.join(Config.homeDir, 'iotame.pid')
        mock({ [pidPath]: '6345' })

        const processMock = sinon.mock(process)
        processMock.expects('kill').withExactArgs(6345, 0).returns(true)

        const container = new Container()
        return container.boot().should.be.rejected
      })
    })
  })
})
