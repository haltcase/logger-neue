import strat from 'strat'
import chalk from 'chalk'
import util from 'util'
import stringify from 'fast-safe-stringify'

import * as helpers from './helpers'

export let format = strat.create({
  upper: str => String(str).toUpperCase(),
  lower: str => String(str).toLowerCase(),
  paren: str => `(${str})`,
  brace: str => `[${str}]`,
  curly: str => `{${str}}`,
  json: str => stringify(str)
})

export function getChalkTemplate (colors) {
  return colors.reduce((acc, color) => {
    return typeof acc[color] === 'function' ? acc[color] : acc.white
  }, chalk)
}

export function createContext (state, args) {
  let { chalker, level, fullColor } = state

  return {
    args,
    level: () => chalker(level),
    timestamp: () => new Date().toISOString(),
    input: () => {
      return args.reduce((acc, cur, i) => {
        return acc + (i ? ' ' : '') + formatInput(fullColor, cur)
      }, '')
    }
  }
}

function formatInput (fullColor, value) {
  if (helpers.isObject(value) || Array.isArray(value)) {
    return util.inspect(value, { colors: fullColor })
  }

  if (!fullColor) return value

  if (value === null) return chalk.magenta('null')

  switch (typeof value) {
    case 'undefined': return chalk.gray('undefined')
    case 'boolean': return chalk.blue(value)
    case 'number': return chalk.yellow(value)
    case 'string': return chalk.green(value)
    default: return util.inspect(value, { colors: true })
  }
}
