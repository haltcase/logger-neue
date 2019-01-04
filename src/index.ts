import { EventEmitter } from 'events'

import * as helpers from './helpers'
import * as defaults from './defaults'
import * as formatter from './formatter'
import consoleTransport from './transports/console'
import fileTransport from './transports/file'

import * as t from './types'

export class LoggerNeue extends EventEmitter {
  [key: string]: any
  console: t.NormalizedConsoleOptions
  file: t.NormalizedFileOptions | false
  levels: t.NormalizedLevelMap

  constructor (options: t.Options = {}) {
    if (!helpers.isObject(options)) {
      throw new TypeError('options must be an object')
    }

    super()

    this.levels = defaults.normalizeLevels(options.levels)
    this.file = defaults.normalizeFileOptions(options.file, this.levels)
    this.console = defaults.normalizeConsoleOptions(options.console, this.levels)

    for (const name of Object.keys(this.levels)) {
      this.addLevel(name, this.levels[name])
    }
  }

  addLevel (name: string, properties: t.LevelDescriptor) {
    if (name in this) return this

    this.levels[name] = defaults.normalizeDefinition(properties)

    this[name] = (...args: any[]) =>
      this.log(name, ...args)

    this[name].format = (template: string, ...args: any[]) => {
      if (args.length === 1) {
        const obj = args[0]
        if (obj == Object(obj)) {
          args = obj
        }
      }

      return this.log(name, formatter.format(template, args))
    }

    return this
  }

  log (level: string, ...args: any[]) {
    let action: string
    let number: number
    let logged = false

    if (typeof level == 'string') {
      if (!(level in this.levels)) {
        throw new Error(`no such log level is defined ('${level}')`)
      }

      action = level
      number = this.levels[level].level
    } else {
      const res = this.getLevelByNumber(level)
      if (!res) {
        throw new Error(`could not find method name for level ${level}`)
      }

      action = res
      number = level
    }

    let cancel = false
    const prevent = () => (cancel = true)

    const props = { name: action, level: number, args, prevent }
    this.emit('pre:log', props)
    this.emit(`pre:log:${action}`, props)

    if (cancel) return

    if (this.console.level >= number) {
      consoleTransport(this as TransportContext, action, formatter, args)
      logged = true
    }

    if (this.file && this.file.level >= number) {
      fileTransport(this as TransportContext, action, formatter, args)
      logged = true
    }

    if (logged) {
      const props = { name: action, level: number, args }
      this.emit('log', props)
      this.emit(`log:${action}`, props)
    }
  }

  getLevelByNumber (n: number): string | void {
    for (const name of Object.keys(this.levels)) {
      if (this.levels[name].level === n) return name
    }
  }

  getNumberOfLevel (name: string): number | void {
    const logLevel = this.levels[name]
    if (logLevel) return Number(logLevel.level) || 0
  }

  getLevelNames (): string[] {
    return Object.keys(this.levels)
  }

  getConsoleLevel (): number {
    return this.console.level
  }

  setConsoleLevel (level: string | number) {
    const res = typeof level == 'string'
      ? this.getNumberOfLevel(level)
      : Number(level)

    this.console.level = typeof res === 'number' ? res : 2
  }

  getFileLevel (): number {
    return this.file ? this.file.level : -1
  }

  setFileLevel (level: string | number) {
    if (!this.file) return

    this.file.level = typeof level === 'string'
      ? this.getNumberOfLevel(level) || 0
      : Number(level) || 0
  }
}

export interface TransportContext extends LoggerNeue {
  file: t.NormalizedFileOptions
}

export interface LogFunction {
  (...args: any[]): void,
  format (template: string, ...args: any[]): void
}

export default <T extends t.Options> (options?: T) => {
  return new LoggerNeue(options) as LoggerNeue & { [K in keyof T['levels']]: LogFunction }
}

export const { templatePresets } = defaults
export * from './types'
