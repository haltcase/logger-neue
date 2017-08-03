'use strict'

const stdoutWriteOriginal = process.stdout.write
const stderrWriteOriginal = process.stderr.write

function interceptor (string, fn) {
  const result = fn(string)
  if (typeof result === 'string') {
    string = result.replace(/\n$/, '')
  }

  return string
}

exports.stdout = function (fn) {
	process.stdout.write = string => interceptor(string, fn)

	return function restore () {
		process.stdout.write = stdoutWriteOriginal
	}
}

exports.stderr = function (fn) {
	process.stderr.write = string => interceptor(string, fn)

	return function restore () {
		process.stderr.write = stderrWriteOriginal
	}
}
