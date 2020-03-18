import sinon from 'sinon'
import Command from '@lib/cli'
import Config from '@config'
import Container from '@lib/app/container'

describe('Command Line Interface', () => {
  afterEach(() => {
    sinon.restore()
  })

  describe('Configuration', () => {
    beforeEach(() => {
      sinon.stub(Container.prototype, 'boot')
    })

    it('initializes the configuration', async () => {
      const spy = sinon.spy(Config, 'initializeFromOclif')

      await Command.run([])

      spy.should.have.been.calledOnceWith({})
    })

    it('passes in the home dir option', async () => {
      const spy = sinon.spy(Config, 'initializeFromOclif')

      await Command.run(['--home', '~/.iotame-new'])

      spy.should.have.been.calledOnceWith({ home: '~/.iotame-new' })
    })
  })

  it('boots the application', async () => {
    const spy = sinon.stub(Container.prototype, 'boot')

    await Command.run([])

    spy.should.have.been.calledOnce
  })
})
