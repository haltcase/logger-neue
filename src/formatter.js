import strat from 'strat'
import chalk from 'chalk'
import util from 'util'

import * as helpers from './helpers'

export let format = strat.create({
  upper: str => String(str).toUpperCase(),
  lower: str => String(str).toLowerCase(),
  paren: str => `(${str})`,
  brace: str => `[${str}]`,
  curly: str => `{${str}}`,
  json: str => JSON.stringify(str)
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

  return fullColor ? util.inspect(value, { colors: true }) : value
}
