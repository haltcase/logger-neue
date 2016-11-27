import * as helpers from './helpers'

export const LEVELS = {
  error: {
    level: 0,
    colors: ['red', 'bgBlack']
  },
  warn: {
    level: 1,
    colors: ['black', 'bgYellow']
  },
  info: {
    level: 2,
    colors: ['green']
  },
  verbose: {
    level: 3,
    colors: ['blue', 'bgBlack']
  },
  debug: {
    level: 4,
    colors: ['cyan']
  },
  silly: {
    level: 5,
    colors: ['inverse']
  }
}

export const CONSOLE = {
  level: 0,
  levels: LEVELS,
  fullColor: false,
  template: '{level}: {input}'
}

export const FILE = {
  dir: process.cwd(),
  level: 0,
  levels: LEVELS,
  template: '{{"level":{level!json},"input":{args!json},"timestamp":{timestamp!json}}}'
}

export function normalizeLevels (levels) {
  if (levels == null) return LEVELS

  if (!helpers.isObject(levels)) {
    throw new TypeError(
      `expected 'options.levels' to be an Object`
    )
  }

  return Object.keys(levels).reduce((acc, cur) => {
    let element = levels[cur]
    if (Array.isArray(element)) {
      acc[cur] = {
        level: Number(element[0]) || 0,
        colors: Array.isArray(element[1]) ? element[1] : [element[1]]
      }

      return acc
    } else if (helpers.isObject(element)) {
      if (helpers.hasProps(element, ['level', 'colors'])) {
        acc[cur] = {
          level: Number(element.level) || 0,
          colors: Array.isArray(element.colors) ? element.colors : [element.colors]
        }

        return acc
      }
    } else {
      throw new TypeError(
        `invalid level definition for 'options.levels.${cur}'`
      )
    }
  }, {})
}
