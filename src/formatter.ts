import { inspect } from 'util'
import colorette, { Style } from 'colorette'
import stringify from 'fast-safe-stringify'
import strat, { Format } from 'strat'

import * as helpers from './helpers'

import * as t from './types'

export type Formatter = {
  createContext: typeof createContext,
  format: Format,
  getColorizer: typeof getColorizer,
  getLevelPadding: typeof getLevelPadding
}

export const styles: Set<t.Style> =
  new Set(Object.keys(colorette).filter(
    key => typeof (colorette as any)[key] === 'function'
  ) as t.Style[])

export const format = strat.create({
  upper: (str: string) => String(str).toUpperCase(),
  lower: (str: string) => String(str).toLowerCase(),
  paren: (str: string) => `(${str})`,
  brace: (str: string) => `[${str}]`,
  curly: (str: string) => `{${str}}`,
  json: (str: string) => stringify(str)
})

export const getColorizer = (styles: t.Style[]): Style => {
  return message => {
    let result = message

    for (const style of styles) {
      result = colorette[style](result)
    }

    return result
  }
}

export const getLevelPadding = (allLevels: string[], thisLevel: string): string => {
  const len = Math.max(...(allLevels.map(n => n.length)))
  return helpers.repeat(' ', len - thisLevel.length)
}

export const createContext = (state: t.InputState, args: any[]): t.Context => {
  const { colorizer, level, padding = '', fullColor } = state

  return {
    args,
    padding,
    level: () => colorizer(level),
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

  if (value === null) return colorette.magenta('null')

  switch (typeof value) {
    case 'undefined': return colorette.gray('undefined')
    case 'boolean': return colorette.blue(String(value))
    case 'number': return colorette.yellow(String(value))
    case 'string': return colorette.green(value)
    default: return inspect(value, { colors: true })
  }
}
