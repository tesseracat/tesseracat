const _ = require('lodash')
const logger = require('../Logger')

const Mutator = require('@iotame/api').Mutator
const Action = require('@iotame/api').Action
const Filter = require('@iotame/api').Filter
const Hook = require('@iotame/api').Hook

module.exports = class HookManager {
  constructor () {
    this.hooks = {};
  }

  dispatcher () {
    return (event, options) => {
      return this._dispatch(event, options)
    }
  }

  add (...elements) {
    _.each(elements, hook => {
      if (!(hook instanceof Hook)) {
        // logger.error('HookManager received something other than a Hook')
        return
      }

      let event = hook.event
      if (!this.hooks[event]) this.hooks[event] = []

      this.hooks[event].push(hook)
    })
  }

  async _dispatch (event, options) {
    let hooks = this._getHooks(event)

    let filtered = false
    try {
      for (let filter of hooks.filter) {
        let response = await filter.call(filter, event, options)

        if (!response) {
          throw new Error('')
        }
      }
    } catch (error) {
      throw new Error(error)
    }

    // Mutate options
    if (options) {
      for (let mutator of hooks.mutator) {
        options = await mutator.call(mutator, event, options)
      }
    }

    // console.log(options)

    /*
    // Perform actions
    if (hooks.action.length > 0) {
      // Try to make this asynchronous / non-blocking!
      _.each(hooks.action, action => {
        action.apply(action, [event, options])
      })
    }
    */

    return options
  }

  _getHooks (event, type) {
    let hooks = _(this.hooks)
      .filter((hook, name) => {
        if (name.endsWith('*')) return event.startsWith(name.replace('*', ''))
        return event == name
      })
      .flatten()
      .value()

    let types = { filter: [], action: [], mutator: [] }
    return _.mapValues(types, (a, type) => {
      return hooks.filter(hook => type == hook.type)
        .map(hook => hook.method())
    })
  }
}
