import fs from 'fs-promise'
import os from 'os'
import path from 'path'

export default function (level, formatter, args) {
  let logPath = path.resolve(this.file.dir, this.file.path)

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
