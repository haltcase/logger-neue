# logger-neue

_logger-neue_ is a work-in-progress experiment trying to refine
the concept of logging in Node. It aims to be easier to configure
with features such as custom log levels compared to similar projects
like [`winston`](https://github.com/winstonjs/winston).

```console
npm install logger-neue
```

More details coming soon, but here's an example configuration:

```javascript
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
    absurd: [5, 'gray']

    // levels can also be defined with Object syntax:
    ridiculous: {
      level: 6,
      colors: ['blue', 'bgYellow', 'underline', 'italic']
    }
  }
})
```

As you can see there's no need to pass a stream for the file or
deal with a complicated transports configuration where you instantiate
a new class. You just pass a path to `logger-neue` and it deals with
the rest.
