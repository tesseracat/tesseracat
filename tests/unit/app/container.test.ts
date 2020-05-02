import Container from '@lib/app/container'
import Config from '@config'
import sinon from 'sinon'
import path from 'path'
import rmfr from 'rmfr'
import mkdirp from 'mkdirp'
import shortid from 'shortid'
import fs from 'fs'
import os from 'os'

class NoProcessError extends Error {
  code = 'ESRCH'
  errno = -3
  syscall = 'kill'
}

describe('Application Container', () => {
  async function removeHomeDir (): Promise<void> {
    await rmfr(Config.homeDir)
  }

  async function createHomeDir (): Promise<void> {
    await mkdirp(Config.homeDir)
  }

  afterEach(async () => {
    sinon.restore()
  })

  describe('.boot()', () => {
    beforeEach(async () => {
      Config.homeDir = path.join(os.tmpdir(), 'iotame', shortid.generate())
      await createHomeDir()
    })

    describe('working directory change', () => {
      it('changes the working directory upon bootup', async () => {
        await new Container().boot()

        process.cwd().should.equal(Config.homeDir)
      })

      it('creates the app directory if it did not exist before', async () => {
        removeHomeDir()
        await new Container().boot()

        fs.existsSync(Config.homeDir).should.be.true
        process.cwd().should.equal(Config.homeDir)
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
        const pidfile = fs.readFileSync(path.join(Config.homeDir, 'iotame.pid'), 'utf8')

        pidfile.should.equal(String(pid))
      })

      it('boots if a pidfile exists and links to a non-running process', async () => {
        fs.writeFileSync(path.join(Config.homeDir, 'iotame.pid'), '6345')

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
        fs.writeFileSync(path.join(Config.homeDir, 'iotame.pid'), '6345')

        const processMock = sinon.mock(process)
        processMock.expects('kill').withExactArgs(6345, 0).returns(true)

        const container = new Container()
        return container.boot().should.be.rejected
      })
    })

    describe('package.json', () => {
      it('copies the default package.json if none exists', async () => {
        await new Container().boot()

        fs.existsSync(path.join(Config.homeDir, 'package.json')).should.be.true
      })

      it('fills out the package.json version', async () => {
        await new Container().boot()

        const content = fs.readFileSync(path.join(Config.homeDir, 'package.json'), 'utf-8')
        const json = JSON.parse(content)

        json.version.should.equal(Config.package.version)
      })

      it('does not replace an existing package.json', async () => {
        fs.writeFileSync(path.join(Config.homeDir, 'package.json'), '{"foo":"bar"}')

        await new Container().boot()

        const content = fs.readFileSync(path.join(Config.homeDir, 'package.json'), 'utf-8')
        const json = JSON.parse(content)

        expect(json).toHaveProperty('foo', 'bar')
      })
    })
  })
})
