import { dirname, resolve } from 'path'
import { EOL } from 'os'
import fs from 'fs-extra'

import { isDirectory } from '../helpers'

import { TransportContext } from '..'
import { Formatter } from '../formatter'

export default (ctx: TransportContext, level: string, formatter: Formatter, args: any[]) => {
  const logPath = resolve(ctx.file.dir, ctx.file.path)

  if (isDirectory(logPath)) {
    throw new Error('cannot set log path to directory')
  }

  fs.ensureDir(dirname(logPath)).then(() => {
    const config = { level, colorizer: (val: string) => val }
    const context = formatter.createContext(config, args)
    const output = formatter.format(ctx.file.template, context)

    const stream = fs.createWriteStream(logPath, { flags: 'a' })
    stream.write(output + EOL)
    stream.on('error', (e: Error) => ctx.emit('error', e))
  })
}
