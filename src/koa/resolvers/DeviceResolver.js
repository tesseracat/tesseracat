module.exports = {
  Query: {
    devices: (obj, args, context) => {
      return context.device.findAll({raw: true})
    },

    device: (obj, args, context) => {
      return context.device.findById(args.id, {raw: true})
    }
  }
}
