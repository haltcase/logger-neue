import { inspect } from 'util'
import chalk, { Chalk } from 'chalk'
import stringify from 'fast-safe-stringify'
import strat, { Format } from 'strat'

import * as helpers from './helpers'

import * as t from './types'

export type Formatter = {
  createContext: typeof createContext,
  format: Format,
  getChalkTemplate: typeof getChalkTemplate
}

export const format = strat.create({
  upper: (str: string) => String(str).toUpperCase(),
  lower: (str: string) => String(str).toLowerCase(),
  paren: (str: string) => `(${str})`,
  brace: (str: string) => `[${str}]`,
  curly: (str: string) => `{${str}}`,
  json: (str: string) => stringify(str)
})

export const getChalkTemplate = (styles: t.Style[]): Chalk => {
  return styles.reduce((acc, color, i) => {
    if (typeof acc[color] === 'function') {
      return acc[color]
    }

    return i === 0 ? acc.white : acc
  }, chalk)
}

export const createContext = (state: t.InputState, args: any[]): t.Context => {
  const { chalker, level, fullColor } = state

  return {
    args,
    level: () => chalker(level),
    timestamp: () => new Date().toISOString(),
    input: (): string =>
      args.reduce((acc, cur, i) => {
        return acc + (i ? ' ' : '') + formatInput(cur, Boolean(fullColor))
      }, '')
  }
}

const formatInput = (value: any, fullColor: boolean): string => {
  if (helpers.isObject(value) || Array.isArray(value)) {
    return inspect(value, { colors: fullColor })
  }

  if (!fullColor) return value

  if (value === null) return chalk.magenta('null')

  switch (typeof value) {
    case 'undefined': return chalk.gray('undefined')
    case 'boolean': return chalk.blue(value.toString())
    case 'number': return chalk.yellow(value.toString())
    case 'string': return chalk.green(value)
    default: return inspect(value, { colors: true })
  }
}
