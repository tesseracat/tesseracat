const argon2 = require('argon2')
const ValidationError = require('../ValidationError')
const Promise = require('bluebird')
const jwt = require('jsonwebtoken')
const secret = require('../jwtSecret')

const readFile = Promise.promisify(require('fs').readFile)
const unlink = Promise.promisify(require('fs').unlink)

module.exports = {
  Mutation: {
    async login (obj, args, context) {
      const { username, password } = args.input
      
      let user = await context.user.findOne({ where: { login: username }, raw: true })
      if (!user) {
        throw new ValidationError({key: 'username', message: 'There are no users with this login name.'})
      }

      let verified = await argon2.verify(user.password, password)
      if (!verified) {
        throw new ValidationError({key: 'password', message: 'Password doesn\'t match our records.'})
      }

      user.accessToken = jwt.sign({ user: user.name, login: user.login, jti: '123' }, secret, { expiresIn: 60 * 60 })
      
      return user
    },

    async createUser (obj, args, context) {
      const { username, password } = args.input
      const registrationToken = args.registrationToken

      const errors = []

      if (!context.state || !context.state.user) {
        if (!registrationToken) {
          throw new ValidationError({key: 'registrationToken', message: 'Unauthenticated users need to provide a registration token.'})
        }

        try {
          let token = await readFile('register.token', 'utf8')

          if (registrationToken !== token) {
            errors.push({key: 'registrationToken', message: 'The provided registration token is not correct.'})
          }
        } catch (e) {
          errors.push({key: 'registrationToken', message: 'No registration token has been created.'})
        }
      }

      if (password.length < 5) {
        errors.push({key: 'password', message: 'Password has to be at least 5 characters long.'})
      }

      if (username.length < 4) {
        errors.push({key: 'username', message: 'Username has to be at least 4 characters long.'})
      }

      if (errors.length) {
        throw new ValidationError(errors)
      }

      let user = await context.user.create({ login: username, password })
      if (registrationToken) await unlink('register.token')

      return user
    }
  }
}
