# logger-neue &middot; [![Version](https://img.shields.io/npm/v/logger-neue.svg?style=flat-square&maxAge=3600)](https://www.npmjs.com/package/logger-neue) [![License](https://img.shields.io/npm/l/logger-neue.svg?style=flat-square&maxAge=3600)](https://www.npmjs.com/package/logger-neue) [![Travis CI](https://img.shields.io/travis/citycide/logger-neue.svg?style=flat-square&maxAge=3600)](https://travis-ci.org/citycide/logger-neue) [![LightScript](https://img.shields.io/badge/written%20in-lightscript-00a99d.svg?style=flat-square)](http://www.lightscript.org)

_logger-neue_ is an attempt to refine the concept of logging in Node.
It aims to be easier to configure than similar projects like
[`winston`](https://github.com/winstonjs/winston) for simple
features like custom log levels and file output.

## installation

```console
npm install logger-neue
```

## usage

```js
import LoggerNeue from 'logger-neue'

// could also be `new LoggerNeue()`
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
    // this example uses array syntax
    error:  [0, ['red', 'bold', 'underline']],
    // arr[0] = the log level
    // arr[1] = an Array ( or single string ) of chalk modifiers
    warn:   [1, 'yellow'],
    info:   [2, 'magenta'],
    debug:  [3, 'cyan'],
    // undefined or invalid `colors` defaults to 'white'
    trace:  [4],
    absurd: [5, 'gray'],

    // levels can also be defined with object syntax:
    ridiculous: {
      level: 6,
      colors: ['blue', 'bgYellow', 'underline', 'italic']
    }
  }
})
```

There's no need to pass a write stream for the file or deal
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

## api

### create <sup>_static_</sup>

```js
create(options)
```

Alternative to using the `new` keyword. Constructs & returns a new instance.
The following are equivalent:

```js
const log = new LoggerNeue()
const log = LoggerNeue.create()
```

> **Arguments**

  - _optional_ `{Object} options`:

  |  property    | type       | default     | description                       |
  | ------------ | :--------: | :---------: | --------------------------------- |
  | `file`       | `Object`   | `{}`        | Configuration for file output.    |
  | `console`    | `Object`   | _see below_ | Configuration for console output. |

  `options.file`:

  | property | type            | default         | description                         |
  | -------- | :-------------: | :-------------: | ----------------------------------- |
  | `dir`    | `string`        | `process.cwd()` | Base directory with which to resolve `path`.  |
  | `level`  | `string` or `number` | `0` or `error`  | Number or name of the output level. |
  | `path`   | `string`        | -               | Path to the log file, resolved with `dir` if relative. |
  | `template` | `string`      | `'{{"level":{level!json},"input":{args!json},"timestamp":{timestamp!json}}}'` | [`strat`][strat] compatible template with which to format the output. See [templates](#templates) for more. |


  `options.file`:

  | property | type            | default         | description                         |
  | -------- | :-------------: | :-------------: | ----------------------------------- |
  | `fullColor` | `boolean` | `false` | Whether to apply color to all types of values. |
  | `level`  | `string` or `number` | `0` or `error`  | Number or name of the output level. |
  | `template` | `string`      | `'{level}: {input}'` | [`strat`][strat] compatible template with which to format the output. See [templates](#templates) for more. |

### addLevel

```js
addLevel(name, properties)
```

> **Arguments**

  - `{string} name`
  - `{Object} properties`:

  |  property  | type       | default     | description                       |
  | ---------- | :--------: | :---------: | --------------------------------- |
  | `level`    | `number`   | `0`         | Determines when this log method fires. |
  | `colors`   | `string` or `string[]` | - | [`chalk`][styles] styles for terminal output, either a single string or array of styles. |
  | `isError`  | `boolean`  | `false`     | If `true`, target `stderr` instead of `stdout`. |

### log

```js
log(level, ...args)
```

Alternative method of calling a log level. The following are equivalent:

```js
log.error('fail')
log('error', 'fail')

// can also call by level number
log(0, 'fail')
```

> **Arguments**

  - `{string|number} level`: name or number of the log level to trigger
  - `{...any} args`: arguments passed to the log level function

### getLevelByNumber

```js
getLevelByNumber(number)
```

> **Arguments**

  - `{number} number`: number to search levels for

> **Returns**

`{string}`: name of the associated level

### getNumberOfLevel

```js
getNumberOfLevel(name)
```

> **Arguments**

  - `{string} name`: name of the level to search for

> **Returns**

`{number}`: logging level of `name`

### getLevelNames

```js
getLevelNames()
```

> **Returns**

`{string[]}`: array of all log level names

### getConsoleLevel

```js
getConsoleLevel()
```

> **Returns**

`{number}`: the current logging level for console output

### setConsoleLevel

```js
setConsoleLevel(level)
```

Set the logging level for console output. Any levels below this are
not output.

> **Arguments**

`{string|number}`: either the name of the level or its logging level number

### getFileLevel

```js
getFileLevel()
```

> **Returns**

`{number}`: the current logging level for file output

### setFileLevel

```js
setFileLevel(level)
```

Set the logging level for file output. Any levels below this are
not output.

> **Arguments**

`{string|number}`: either the name of the level or its logging level number

## templates

The [`strat`][strat] module is used to format all output strings. The
templates are customizable by passing them to the `console` or `file`
options objects at construction time.

You can also use the `format()` method of any log level to pass a
template to be interpolated.

The variables replaced from a template are:

| name    | description |
| ------- | ----------- |
| `args`  | Array of the raw arguments passed to the log function. |
| `input` | Array of the arguments after they've been processed & stylized. |
| `level` | Name of the log level, stylized by default with `chalk` for terminals. |
| `timestamp` | Defaults to an ISO string timestamp of log time. |

In addition, there are various transformers available to modify the
above variables just by appending them to the variable name after a `!`,
like this substring taken from the default `file` template:

```js
'{level!json}'
```

The `json` transformer stringifies its argument, `level` in this case.

All the transformers available are:

| name    | description                               |
| ------- | ----------------------------------------- |
| `upper` | Upper cases the argument                  |
| `lower` | Lower cases the argument                  |
| `paren` | Wraps the argument in parentheses         |
| `brace` | Wraps the argument in braces (`[]`)       |
| `curly` | Wraps the argument in curly braces (`{}`) |
| `json`  | JSON stringifies the argument             |

See the [`strat`][strat] documentation for more info and usage
examples for these transformers.

## events

Each instance of _logger-neue_ is also an event emitter, so you can use all
methods of Node's [`EventEmitter`](https://nodejs.org/api/events.html#events_class_eventemitter)
on it:

```js
const log = LoggerNeue.create()
log.on('log', event => {
  const { name, level, args } = event
})

log.on('log:info', event => {
  // only `log.info()` with trigger this
  const { name, level, args } = event
})

log.once(/* ... */)
log.removeAllListeners()
// etc
```

## contributing

Pull requests and any [issues](https://github.com/citycide/logger-neue/issues)
found are always welcome.

1. Fork the project, and preferably create a branch named something like `feat-make-better`
2. Modify the [LightScript][lsc] source in the `src` directory as needed
3. Run `npm test` to make sure all tests continue to pass, and it never hurts to have more tests
4. Push & pull request! :tada:

## see also

- [LightScript][lsc] - the compile-to-JS language this project is written in, leveraging [Babel](https://babeljs.io)
- [strat][strat] - string formatting library at home in ES2015+ JavaScript
- [chalk](https://github.com/chalk/chalk) - terminal string styling done right

## license

MIT © [Bo Lingen / citycide](https://github.com/citycide)

[lsc]: http://www.lightscript.org
[strat]: https://github.com/citycide/strat
[styles]: https://github.com/chalk/chalk#styles