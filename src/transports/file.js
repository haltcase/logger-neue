import fs from 'fs-promise'
import path from 'path'
import os from 'os'

import { isDirectory } from '../helpers'

export default function (level, formatter, args) {
  let logPath = path.resolve(this.file.dir, this.file.path)

  if (isDirectory(logPath)) {
    throw new Error('cannot set log path to directory')
  }

  fs.ensureDir(path.dirname(logPath)).then(() => {
    let context = formatter.createContext(
      { level, chalker: val => val }, args
    )
    let output = formatter.format(this.file.template, context)

    let stream = fs.createWriteStream(logPath, { flags: 'a' })
    stream.write(output + os.EOL)
    stream.on('error', e => this.emit('error', e))
  })
}
