module.exports = {
  Query: {
    settings (obj, args, context) {
      return {
        iotameHome: 'no',
        daemonized: false
      }
    }
  }
}
