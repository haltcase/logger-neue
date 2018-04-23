import * as helpers from './helpers'
import * as t from './types'

export type DefaultLevelMap = {
  readonly [key: string]: {
    readonly level: number,
    readonly style: t.Style[],
    readonly isError: boolean
  }
}

export const LEVELS: DefaultLevelMap = Object.freeze({
  error: {
    level: 0,
    style: ['red', 'bgBlack'] as t.Style[],
    isError: true
  },
  warn: {
    level: 1,
    style: ['black', 'bgYellow'] as t.Style[],
    isError: false
  },
  info: {
    level: 2,
    style: ['green'] as t.Style[],
    isError: false
  },
  verbose: {
    level: 3,
    style: ['blue', 'bgBlack'] as t.Style[],
    isError: false
  },
  debug: {
    level: 4,
    style: ['cyan'] as t.Style[],
    isError: false
  },
  silly: {
    level: 5,
    style: ['inverse'] as t.Style[],
    isError: false
  }
})

export type DefaultConsoleOptions = {
  readonly fullColor: boolean,
  readonly level: number,
  readonly levels: DefaultLevelMap,
  readonly template: string
}

export const CONSOLE: DefaultConsoleOptions = Object.freeze({
  fullColor: false,
  level: 2,
  levels: LEVELS,
  template: '{level}: {input}'
})

export type DefaultFileOptions = {
  readonly dir: string,
  readonly level: number,
  readonly levels: DefaultLevelMap,
  readonly template: string
}

export const FILE: DefaultFileOptions = Object.freeze({
  dir: process.cwd(),
  level: 0,
  levels: LEVELS,
  template:
    '{{"level":{level!json},' +
    '"input":{args!json},' +
    '"timestamp":{timestamp!json}}}'
})

export type DefaultOptions = {
  file: DefaultFileOptions,
  console: DefaultConsoleOptions
}

export const OPTIONS: DefaultOptions = Object.freeze({
  file: FILE,
  console: CONSOLE
})

export const normalizeConsoleOptions = (
  options: t.ConsoleOptions,
  levels: t.NormalizedLevelMap
): t.NormalizedConsoleOptions => {
  if (!options) return { ...CONSOLE }

  const result = helpers.mergeOptions(options, CONSOLE)
  if (options.levels) {
    result.levels = normalizeLevels(options.levels)
  }

  if (typeof options.level === 'string') {
    result.level = levels[options.level].level || 0
  }

  return result
}

export type WithoutPath = {
  path: void | never,
  [key: string]: any
}

export const normalizeFileOptions: {
  <T extends WithoutPath> (
    options: T | null | undefined,
    levels: t.NormalizedLevelMap
  ): false
  (options: t.FileOptions, levels: t.NormalizedLevelMap): t.NormalizedFileOptions
} = <T extends t.FileOptions> (
  options: T | null | undefined,
  levels: t.NormalizedLevelMap
): any => {
  if (!options || !options.path) return false

  const result: t.NormalizedFileOptions = {
    ...FILE,
    path: options.path
  }

  if (options.levels) {
    result.levels = normalizeLevels(options.levels)
  }

  if (typeof options.level === 'string') {
    result.level = levels[options.level].level || 0
  }

  return result
}

export const normalizeDefinition = (definition: t.LevelDescriptor): t.NormalizedLevelDescriptor => {
  let level: number
  let style: t.Style | t.Style[] | undefined
  let isError: boolean | undefined

  if (Array.isArray(definition)) {
    ;[level, style = 'white', isError = false] = definition as t.LevelDescriptorTuple3
  } else if (helpers.isObject(definition)) {
    ;({ level, style = 'white', isError = false } = definition)
  } else {
    throw new TypeError(`invalid level definition`)
  }

  return {
    level: Number(level) || 0,
    style: Array.isArray(style) ? style : [style],
    isError: Boolean(isError)
  }
}

export const normalizeLevels = (levels?: t.LevelMap | null): t.NormalizedLevelMap => {
  if (levels == null) {
    return Object.assign({}, LEVELS)
  }

  if (!helpers.isObject(levels)) {
    throw new TypeError(`expected 'options.levels' to be an Object`)
  }

  const obj = {} as t.NormalizedLevelMap
  for (const name of Object.keys(levels)) {
    obj[name] = normalizeDefinition(levels[name])
  }
  return obj
}
