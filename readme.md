# logger-neue &middot; [![Version](https://img.shields.io/npm/v/logger-neue.svg?style=flat-square&maxAge=3600)](https://www.npmjs.com/package/logger-neue) [![License](https://img.shields.io/npm/l/logger-neue.svg?style=flat-square&maxAge=3600)](https://www.npmjs.com/package/logger-neue) [![JavaScript Standard Style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square&maxAge=3600)](https://standardjs.com)

_logger-neue_ is a work-in-progress experiment trying to refine
the concept of logging in Node. It aims to be easier to configure
with features such as custom log levels compared to similar projects
like [`winston`](https://github.com/winstonjs/winston).

## installation

```console
npm install logger-neue
```

## usage

Documentation will probably be scarce while _logger-neue_ is in heavy development but here's a quick overview ( which is easily enough to get started ):

```js
import LoggerNeue from 'logger-neue'

const log = LoggerNeue.create({
  file: {
    // if relative, resolved using `process.cwd()`
    path: './test.log',
    // to specify the base directory, also pass the `dir` property
    dir: __dirname,
    // level defaults to 'error'
    level: 'error'
  },
  console: {
    // pass either a string or number
    // resolved against the log level map
    level: process.env.NODE_ENV === 'development' ? 'trace' : 'error',
    // if set to true, uses the `colors` option of `util.inspect`
    // for all logged arguments, regardless of type
    fullColor: true
  },
  levels: {
    // the level map to be used for both file & console
    // this example uses the Array syntax
    error:  [0, ['red', 'bold', 'underline']],
    // arr[0] = the log level
    // arr[1] = an Array ( or single string ) of chalk modifiers
    warn:   [1, 'yellow'],
    info:   [2, 'magenta'],
    debug:  [3, 'cyan'],
    // undefined or invalid `colors` defaults to 'white'
    trace:  [4],
    absurd: [5, 'gray'],

    // levels can also be defined with Object syntax:
    ridiculous: {
      level: 6,
      colors: ['blue', 'bgYellow', 'underline', 'italic']
    }
  }
})
```

So there's no need to pass a write stream for the file or deal
with a complicated transports configuration. You just have to
define `options.file` and provide a `path` - _logger-neue_ does
the rest.

And the console transport is even easier. Minimum configuration
for a prettier alternative to the standard `console.log` would be:

```js
const log = LoggerNeue.create()
```

Or even prettier, with full color:

```js
const log = LoggerNeue.create({
  console: { fullColor: true }
})
```

## contributing

Pull requests and any [issues](https://github.com/citycide/stunsail/issues)
found are always welcome.

## see also

- [LightScript](http://www.lightscript.org) - the compile-to-JS language _logger-neue_ is written in, leveraging [Babel](https://babeljs.io)

## license

MIT © [Bo Lingen / citycide](https://github.com/citycide)
