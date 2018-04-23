import { EOL } from 'os'

import { TransportContext } from '..'
import { Formatter } from '../formatter'

// give the `console` object an index signature
declare global {
  interface Console {
    [key: string]: Function
  }
}

export default function (ctx: TransportContext, level: string, formatter: Formatter, args: any[]) {
  const { style, isError } = ctx.levels[level]

  const chalker = formatter.getChalkTemplate(style)
  const config = { level, chalker, fullColor: ctx.console.fullColor }
  const context = formatter.createContext(config, args)
  const output = formatter.format(ctx.console.template, context)

  if (isError) {
    if (typeof window !== 'undefined') {
      // basic browser support for Electron
      const target = console.error || (() => {})
      target(`${level}: `, ...args)
    } else {
      process.stderr.write(output + EOL)
    }
  } else {
    if (typeof window !== 'undefined') {
      // basic browser support for Electron
      const target = console[level] || console.log
      target(`${level}: `, ...args)
    } else {
      process.stdout.write(output + EOL)
    }
  }
}
