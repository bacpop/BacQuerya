export const TYPE_UNDEFINED = 'undefined'
export const TYPE_FUNCTION = 'function'
export const TYPE_NUMBER = 'number'
export const TYPE_STRING = 'string'
export const TYPE_ARRAY = 'array'
export const TYPE_PROMISE = 'promise'
export const TYPE_OBJECT = 'object'
export const TYPE_NULL = 'null'
export const TYPE_UNKNOWN = 'unknown'
export const TYPE_DATE = 'date'
export const TYPE_ANY = 'any'
export const TYPE_NOT_SET = '(not set)'

export const ERROR_EMPTY = 'empty'
export const ERROR_MIXED = 'mixed'
export const ERROR_UNSUPPORTED = 'unsupported'

export const getType = value => {
  const type = typeof value

  // Ignore React elements
  if (value.$$typeof) {
    return TYPE_UNKNOWN
  }

  if (type === 'undefined') return TYPE_UNDEFINED
  if (type === TYPE_NUMBER) return TYPE_NUMBER
  if (type === TYPE_STRING) return TYPE_STRING
  if (type === TYPE_FUNCTION) return TYPE_FUNCTION
  if (value instanceof Array) return TYPE_ARRAY
  if (value instanceof Promise) return TYPE_PROMISE
  if (value instanceof Date) return TYPE_DATE
  if (value instanceof Object) return TYPE_OBJECT
  if (value === null) return TYPE_NULL

  return TYPE_UNKNOWN
}

export const isIdentical = (base, compare) => {
  // The order is somewhat important; only base's props are checked
  const type = getType(base)
  if (type !== getType(compare)) {
    return false
  }
  if (type === TYPE_ARRAY) {
    if (base.length !== compare.length) {
      return false
    }
  }
  // No idea what this is, assume it matches
  if (type === TYPE_UNKNOWN) {
    return true
  }
  if (type === TYPE_OBJECT || type === TYPE_ARRAY) {
    return Object.keys(base).every(prop => isIdentical(base[prop], compare[prop]))
  }
  return base === compare
}
