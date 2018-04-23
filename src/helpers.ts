import { statSync } from 'fs-extra'

import { DeepMutable, Defined, LooseObject } from './types'

const ignorableErrors = ['ENOENT', 'ENOTDIR']

export const mergeOptions = <T extends LooseObject, U extends LooseObject> (
  object: T,
  defaults: U
): Defined<T> & Defined<DeepMutable<U>> => {
  const result: LooseObject = {}

  const totalKeys = new Set([
    ...Object.getOwnPropertyNames(object),
    ...Object.getOwnPropertyNames(defaults)
  ])

  for (const key of totalKeys) {
    const value = object[key]
    result[key] = value == null || Number.isNaN(value)
      ? defaults[key]
      : value
  }

  return result as Defined<T> & Defined<DeepMutable<U>>
}

export const isObject = (value: any): value is { [key: string]: any } => {
  return value === Object(value) && !Array.isArray(value)
}

export const isDirectory = (path: string) => {
  try {
    return statSync(path).isDirectory()
  } catch (err) {
    if (!ignorableErrors.includes(err.code)) {
      throw err
    }

    return false
  }
}
