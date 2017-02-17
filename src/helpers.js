export function isObject (value) {
  return value === Object(value) && !Array.isArray(value)
}

export function hasProps (object, keys) {
  return keys.every(key => ({}.hasOwnProperty.call(object, key)))
}

export function isDirectory (path) {
  try {
    const { statSync } = require('fs')
    return statSync(path).isDirectory()
  } catch (err) {
    if (err.code !== 'ENOENT' && err.code !== 'ENOTDIR') {
      throw err
    }
  }

  return false
}
