import assign from 'assign-deep'
import EventEmitter from 'events'

import transports from './transports'
import * as helpers from './helpers'
import * as defaults from './defaults'
import * as formatter from './formatter'

class LoggerNeue extends EventEmitter {
  constructor (options = defaults.OPTIONS) {
    super()

    if (!helpers.isObject(options)) {
      throw new TypeError('options must be an object')
    }

    this.file = options.file && options.file.path
      ? assign({}, defaults.FILE, options.file)
      : false

    this.console = assign({}, defaults.CONSOLE, options.console)
    this.levels = defaults.normalizeLevels(options.levels)

    if (this.file) {
      this.fileLevel = this.file.level
    }
    this.consoleLevel = this.console.level

    Object.keys(this.levels).map(name => {
      let { level, colors } = this.levels[name]
      this.addLevel(name, level, colors)
    })
  }

  static create (options) {
    return new LoggerNeue(options)
  }

  addLevel (name, level, colors) {
    this.levels[name] = { level, colors }

    if (!this[name]) {
      this[name] = (...args) => {
        this.log(name, ...args)
      }

      this[name].format = (template, ...args) => {
        if (args.length === 1) {
          let obj = args[0]
          if (obj === Object(obj)) {
            args = obj
          }
        }
        this.log(name, formatter.format(template, args))
      }
    }
  }

  log (level, ...args) {
    let action, number, logged

    if (typeof level === 'string') {
      if (!(level in this.levels)) {
        throw new Error(`no such log level is defined ('${level}')`)
      }

      action = level
      number = this.levels[level].level
    } else {
      let res = this.getLevelByNumber(level)
      if (!res) {
        throw new Error(`could not find a log name for level ${level}`)
      }

      action = res
      number = level
    }

    if (this.consoleLevel >= number) {
      transports.console.call(this, action, formatter, args)
      logged = true
    }

    if (this.file && this.fileLevel >= number) {
      transports.file.call(this, action, formatter, args)
      logged = true
    }

    if (logged) {
      let props = { name: action, level: number, args }
      this.emit('log', props)
      this.emit(`log:${action}`, props)
    }
  }

  getLevelByNumber (n) {
    return Object.keys(this.levels).reduce((_, name) => {
      let { level } = this.levels[name] || {}
      if (level === n) return name
    })
  }

  getNumberOfLevel (name) {
    return Number((this.levels[name] || {}).level) || 0
  }

  get levelNames () {
    return Object.keys(this.levels)
  }

  get consoleLevel () {
    return this.console.level
  }

  set consoleLevel (level) {
    if (typeof level === 'string') {
      this.console.level = this.getNumberOfLevel(level)
    } else {
      this.console.level = Number(level) || 0
    }
  }

  get fileLevel () {
    return this.file.level
  }

  set fileLevel (level) {
    if (typeof level === 'string') {
      this.file.level = this.getNumberOfLevel(level)
    } else {
      this.file.level = Number(level) || 0
    }
  }
}

export default LoggerNeue
