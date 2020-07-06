# logger-neue &middot; [![Version](https://flat.badgen.net/npm/v/logger-neue)](https://www.npmjs.com/package/logger-neue) [![License](https://flat.badgen.net/npm/license/logger-neue)](https://www.npmjs.com/package/logger-neue) [![Travis CI](https://flat.badgen.net/travis/citycide/logger-neue)](https://travis-ci.org/citycide/logger-neue) [![TypeScript](https://flat.badgen.net/badge/written%20in/TypeScript/294E80)](http://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)

_logger-neue_ is an attempt to refine the concept of logging in Node. It aims
to be easier to configure than similar projects like [`winston`][winston]
for simple features like custom log levels and file output.

It also has basic support for Node-ish environments like Electron's renderer,
where it will write to the developer tools console.

Since v2, _logger-neue_ is written in strict TypeScript and includes type definitions. :tada:

[installation](#installation) &middot; [usage](#usage) &middot; [api](#api) &middot; [defaults](#defaults) &middot; [templates](#templates) &middot; [events](#events) &middot; [contributing](#contributing) &middot; [license](#license)

## installation

1. install

   Using [Yarn][yarn]:

   ```console
   yarn add logger-neue
   ```

   Or using npm:

   ```console
   npm install logger-neue
   ```

2. import

   In TypeScript / ES2015+:

   ```ts
   import loggerNeue from "logger-neue"
   ```

   In ES5 / commonjs:

   ```js
   const loggerNeue = require("logger-neue").default
   ```

## usage

While _logger-neue_ is highly configurable, minimum configuration for a
prettier alternative to the standard `console.log` is as simple as:

```js
const log = loggerNeue()
```

Or even prettier, with full color:

```js
const log = loggerNeue({
  console: { fullColor: true }
})
```

Below is an example of a more thorough configuration. Note that there's no
need to pass a write stream for the file or deal with a complicated transports
configuration. You just have to define `options.file` and provide a `path`
&mdash; _logger-neue_ does the rest.

```js
import loggerNeue from "logger-neue"

import { dirname } from "path"

const log = loggerNeue({
  file: {
    // if relative, resolved using `process.cwd()`
    path: "./test.log",
    // to specify the base directory, also pass the `dir` property
    dir: dirname(import.meta.url),
    // level defaults to "error"
    level: "error"
  },
  console: {
    // pass either a string or number
    // resolved against the log level map below
    level: process.env.NODE_ENV === "development" ? "trace" : "error",
    // if set to true, uses the `colors` option of `util.inspect`
    // for all logged arguments, regardless of type
    fullColor: true
  },
  levels: {
    // the level map to be used for both file & console
    // this example uses array syntax
    error:  [0, ["red", "bold", "underline"]],
    // array[0] = the log level
    // array[1] = an array ( or single string ) of colorette modifiers
    warn:   [1, "yellow"],
    info:   [2, "magenta"],
    debug:  [3, "cyan"],
    // undefined or invalid `style` defaults to "white"
    trace:  [4],
    absurd: [5, "gray"],

    // levels can also be defined with object syntax:
    ridiculous: {
      level: 6,
      style: ["blue", "bgYellow", "underline", "italic"]
    }
  }
})
```

## api

### loggerNeue (`constructor`)

```js
loggerNeue(options)
```

There are actually two ways to create a new instance &mdash; you can use the default
export (which is a function) or the named export `LoggerNeue`. This means the following
are (roughly) equivalent:

```js
import loggerNeue, { LoggerNeue } from "logger-neue"
const logger1 = new LoggerNeue()
const logger2 = loggerNeue()
```

The difference is that `LoggerNeue` is the raw class, and the default export is a
wrapper function that [provides helpful type information][impl] based on your provided
level definitions.

> **Arguments**

  - _optional_ `{object} options`:

  | property  | type       | default     | description                       |
  | --------- | :--------: | :---------: | --------------------------------- |
  | `file`    | `object` or `false` | `false`        | Configuration for file output.    |
  | `console` | `object`   | _see below_ | Configuration for console output. |

  `options.file`:

  | property   | type            | default         | description                         |
  | ---------- | :-------------: | :-------------: | ----------------------------------- |
  | `dir`      | `string`        | `process.cwd()` | Base directory with which to resolve `path`.  |
  | `level`    | `string` or `number` | `0` or `error`  | Number or name of the output level. |
  | `path`     | `string`        | -               | Path to the log file, resolved with `dir` if relative. |
  | `template` | `string`        | [_see here_](#default-templates) | [`strat`][strat] compatible template with which to format the output. See [templates](#templates) for more. |

  `options.console`:

  | property    | type            | default         | description                         |
  | ----------- | :-------------: | :-------------: | ----------------------------------- |
  | `fullColor` | `boolean`       | `false` | Whether to apply color to all types of values. |
  | `level`     | `string` or `number` | `2` or `info`  | Number or name of the output level. |
  | `template`  | `string`        | [_see here_](#default-templates) | [`strat`][strat] compatible template with which to format the output. See [templates](#templates) for more. |

  `options.levels`:

  If provided as an object, it should have these properties:

  |  property  | type       | default     | description                       |
  | ---------- | :--------: | :---------: | --------------------------------- |
  | `level`    | `number`   | `0`         | Determines when this log method fires. |
  | `style`   | `string` or `string[]` | - | [`colorette`][styles] styles for terminal output, either a single string or array of styles. |
  | `isError`  | `boolean`  | `false`     | If `true`, target `stderr` instead of `stdout`. |

  If provided as an array, it should take the form of `[level, style, isError]`

### addLevel

```js
addLevel(name, properties)
```

> **Arguments**

  - `{string} name`
  - `{Object} properties`:

  If provided as an object, it should have these properties:

  |  property  | type       | default     | description                       |
  | ---------- | :--------: | :---------: | --------------------------------- |
  | `level`    | `number`   | `0`         | Determines when this log method fires. |
  | `style`   | `string` or `string[]` | - | [`colorette`][styles] styles for terminal output, either a single string or array of styles. |
  | `isError`  | `boolean`  | `false`     | If `true`, target `stderr` instead of `stdout`. |

  If provided as an array, it should take the form of `[level, style, isError]`

### log

```js
log(level, ...args)
```

Alternative method of calling a log level. The following are equivalent:

```js
log.error("fail")
log("error", "fail")

// can also call by level number
log(0, "fail")
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

Set the logging level for console output. Any levels below this are not output.

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

## defaults

_logger-neue_ attempts to make setup as painless as possible,
which means it uses sane defaults to allow for minimal or zero configuration.

Without providing a config object, _logger-neue_ uses the following
defaults:

```js
options = {
  // no file output
  file: false,
  console: {
    // will output "info", "warn", and "error"
    level: "info",
    // does not apply color to primitives
    fullColor: false,
    template: "{level}{padding}  {input}"
  },
  levels: {
    //       [level, style, isError]
    error:   [0, ["red", "bgBlack"], true],
    warn:    [1, ["black", "bgYellow"], false],
    info:    [2, ["green"], false],
    verbose: [3, ["blue", "bgBlack"], false],
    debug:   [4, ["cyan"], false],
    silly:   [5, ["inverse"], false]
  }
}
```

If `options.file.path` is provided, these defaults are used for the rest of
the properties in `options.file`:

```js
options.file = {
  // used as base directory if `path` is relative
  dir: process.cwd(),
  // only outputs "error"
  level: 0,
  template:
    `{{"level":{level!json},` +
    `"input":{args!json},` +
    `"timestamp":{timestamp!json}}}`
}
```

This means a console-only config can be as simple as:

```js
const logger = loggerNeue()
```

... and adding additional output to a file can be as simple as:

```js
const logger = loggerNeue({
  file: { path: "./log.txt" }
})
```

## templates

The [`strat`][strat] module is used to format all output strings. The templates
are customizable by passing them to the `console` or `file` options objects at
construction time.

You can also use the `format()` method of any log level to pass a template to
be interpolated.

### variables

The variables replaced from a template are:

| name    | description |
| ------- | ----------- |
| `args`  | Array of the raw arguments passed to the log function. |
| `padding` | String of spaces for use in aligning log levels of varying lengths. |
| `input` | Array of the arguments after they've been processed & stylized. |
| `level` | Name of the log level, stylized by default with `colorette` for terminals. |
| `timestamp` | Defaults to an ISO string timestamp of log time. |

### presets

Several template presets are exported for your usage:

```js
import loggerNeue, { templatePresets } from "logger-neue"

const log = loggerNeue({
  console: {
    fullColor: true,
    template: templatePresets.bracketedLevel
  }
})

log.info("hello there!")
// -> [info]        hello there!

log.ridiculous("hello again!")
// -> [ridiculous]  hello again!
```

<a name="default-templates"></a>

| name             | template                                  |
| ---------------- | ----------------------------------------- |
| `alignLeft`¹     | `{level}{padding}  {input}`               |
| `alignRight`     | `{padding}{level}  {input}`               |
| `separatedColon` | `{level}: {input}`                        |
| `bracketedLevel` | `[{level}]{padding}  {input}`             |
| `jsonTimestamp`² | `{{"level":{level!json},"input":{args!json},"timestamp":{timestamp!json}}}` |

_¹ default console template_<br/>
_² default file template_

### transformers

Templates also support transformers &mdash; functions that modify the above
variables just by appending them to the variable name after a `!`, like
this substring taken from the default `file` template:

```js
"{level!json}"
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

See the [`strat`][strat] documentation for more details about how these
transformers work.

## events

Each instance of _logger-neue_ is also an event emitter, so you can use all
methods of Node's [`EventEmitter`][node_events] on it:

```js
const log = loggerNeue()
log.on("log", event => {
  const { name, level, args } = event
})

log.on("log:info", event => {
  // only `log.info()` will trigger this
  const { name, level, args } = event
})

log.once(/* ... */)
log.removeAllListeners()
// etc
```

There are also events emitted prior to the log being output &mdash; just
prepend `pre:` to the events in the above example. These events provide
the same fields but with the addition of a `prevent()` function. Calling
this function prevents the log from being output.

```js
log.on("pre:log", event => {
  const { name, level, args, prevent } = event
})

log.on("pre:log:trace", event => {
  // prevent all output when `log.trace()` is called
  event.prevent()
})
```

## contributing

This project is open to contributions of all kinds! Please check and search
the [issues][issues] if you encounter a problem before opening a new one.
[Pull requests][prinfo] for improvements are also welcome.

1. Fork the project, and preferably create a branch named something like `feat-make-better`
2. Modify the source files in the `src` directory as needed
3. Run `npm test` to make sure all tests continue to pass, and it never hurts to have more tests
4. Commit, push, and open a pull request.

## see also

- [strat][strat] &ndash; string formatting library at home in ES2015+ JavaScript
- [colorette][colorette] &ndash; terminal string styling done right

## license

MIT © [Bo Lingen / citycide](https://github.com/citycide)

[winston]: https://github.com/winstonjs/winston
[yarn]: https://yarnpkg.com
[colorette]: https://github.com/jorgebucaran/colorette
[strat]: https://github.com/citycide/strat
[node_events]: https://nodejs.org/api/events.html#events_class_eventemitter
[styles]: https://github.com/jorgebucaran/colorette#styles
[impl]: https://github.com/citycide/logger-neue/blob/fd4b2ba33303aedb46745b520f3873ae5be4a809/src/index.ts#L143-L145

[issues]: https://github.com/citycide/logger-neue/issues
[prinfo]: https://help.github.com/articles/creating-a-pull-request/
