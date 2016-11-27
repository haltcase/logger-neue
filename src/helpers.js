export function isObject (value) {
  return value === Object(value) && !Array.isArray(value)
}

export function hasProps (object, keys) {
  return keys.every(key => ({}.hasOwnProperty.call(object, key)))
}
