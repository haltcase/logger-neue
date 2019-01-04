import { EOL } from 'os'

import { TransportContext } from '..'
import { Formatter } from '../formatter'
import { isBrowser } from '../helpers'

// give the `console` object an index signature
declare global {
  interface Console {
    [key: string]: Function
  }
}

export default (ctx: TransportContext, level: string, formatter: Formatter, args: any[]) => {
  const { style, isError } = ctx.levels[level]

  if (isBrowser) {
    // basic browser support for Electron
    if (isError) {
      console.error(`${level}:`, ...args)
    } else {
      const target = console[level] || console.log
      target(`${level}:`, ...args)
    }
  }

  const padding = formatter.getLevelPadding(ctx.getLevelNames(), level)
  const chalker = formatter.getChalkTemplate(style)
  const config = { level, padding, chalker, fullColor: ctx.console.fullColor }
  const context = formatter.createContext(config, args)
  const output = formatter.format(ctx.console.template, context)

  if (isError) {
    process.stderr.write(output + EOL)
  } else {
    process.stdout.write(output + EOL)
  }
}
