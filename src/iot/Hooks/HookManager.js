let _ = require('lodash')
let logger = require('winston')

let Mutator = require('./Mutator')
let Action = require('./Action')
let Filter = require('./Filter')
let Hook = require('./Hook')

module.exports = class HookManager {
  constructor () {
    this.hooks = {};
  }

  dispatcher () {
    return (event, caller, options) => {
      return this._dispatch(event, caller, options)
    }
  }

  add (...elements) {
    _.each(elements, hook => {
      if (!(hook instanceof Hook)) {
        // logger.error('HookManager received something other than a Hook')
        return
      }

      let event = hook.event

      if (!this.hooks[event]) {
        this.hooks[event] = []
      }

      this.hooks[event].push(hook)
    })
  }

  _dispatch (event, caller, options) {
    let filtered = _.some(this._filters(event, caller), filter => {
      filter.apply(filter, [event, caller, options])
    })

    // Return if event was filtered
    if (filtered) return { filtered: true, options }

    // Mutate options
    if (options) {
      _.each(this._mutators(event, caller), mutator => {
        options = mutator.apply(mutator, [event, caller, options])
      })
    }

    // Perform actions
    _.each(this._actions(event, caller), action => {
      // TODO: Make sure actions are called asynchronously ?
      action.apply(action, [event, caller, options])
    })

    return { filtered: false, options }
  }

  _getHook (event, caller, type) {
    if (!this.hooks[event])
      return []

    return _(this.hooks[event])
      .filter(hook => hook.type == type)
      // .filter(hook => true) Check for caller inheritance
      .map(hook => hook.method())
      .value()
  }

  _filters (event, caller) {
    return this._getHook(event, caller, 'filter')
  }

  _mutators (event, caller) {
    return this._getHook(event, caller, 'mutator')
  }

  _actions (event, caller) {
    return this._getHook(event, caller, 'action')
  }
}
