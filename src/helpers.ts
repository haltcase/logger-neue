import { mkdir, statSync } from "fs"
import { dirname } from "path"
import { promisify } from "util"

import { DeepMutable, Defined, LooseObject } from "./types"

const mkdirMode = parseInt("0777", 8)
const ignorableErrors = ["ENOENT", "ENOTDIR"]

const mkdirAsync = promisify(mkdir)

export const isBrowser: boolean = new Function(`
  return (function () {
    return (
      typeof window !== "undefined" &&
      this === window
    )
  }).call(undefined)
`)()

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

export const isDirectorySync = (path: string) => {
  try {
    return statSync(path).isDirectory()
  } catch (err) {
    if (!ignorableErrors.includes(err.code)) {
      throw err
    }

    return false
  }
}

export const ensureDir = async (path: string): Promise<boolean> => {
  try {
    await mkdirAsync(path, mkdirMode)
    return true
  } catch (err) {
    if (err.code === "EEXIST") {
      return isDirectorySync(path)
    }

    if (err.code === "ENOENT") {
      const target = dirname(path)
      return (
        target !== path &&
        await ensureDir(target) &&
        (await mkdirAsync(path, mkdirMode), true)
      )
    }

    return false
  }
}
