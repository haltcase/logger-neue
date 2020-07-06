const stdoutWriteOriginal = process.stdout.write
const stderrWriteOriginal = process.stderr.write

const interceptor = (string: string, fn: (str: string) => any) => {
  const result = fn(string)
  if (typeof result === "string") {
    string = result.replace(/\n$/, "")
  }

  return Boolean(string)
}

export const stdout = (fn: (str: string) => any) => {
  process.stdout.write = (str: string) => interceptor(str, fn)

  return () => {
    process.stdout.write = stdoutWriteOriginal
  }
}

export const stderr = (fn: (str: string) => any) => {
  process.stderr.write = (str: string) => interceptor(str, fn)

  return () => {
    process.stderr.write = stderrWriteOriginal
  }
}
