<a name="v3.1.0"></a>
### [`v3.1.0`](https://github.com/citycide/logger-neue/compare/v3.0.0...v3.1.0) (2020-07-05)


###### FEATURES

* add esm entry point ([`ddd5b37`](https://github.com/citycide/logger-neue/commit/ddd5b373fc0567ec35f0aaab81f51d4735c1b3e4))
* add named export for default factory function ([`a84f1e7`](https://github.com/citycide/logger-neue/commit/a84f1e7dca1c6f2b176dc5d9e02c74539f36107a))

---

<a name="v3.0.0"></a>
### [`v3.0.0`](https://github.com/citycide/logger-neue/compare/v2.2.0...v3.0.0) (2019-06-13)

With this release, logger-neue will now be an even lighter package. Its two
largest dependencies ([chalk](https://github.com/chalk/chalk) & [fs-extra](https://github.com/jprichardson/node-fs-extra))
have been replaced and removed, respectively. Install size will decrease from
around 371kB to about 107kB.

###### BREAKING CHANGES

* invalid style names in level descriptors will now cause errors to be thrown.
* chalk has many features not used in logger-neue and has been removed in favor of
the much smaller [colorette](https://github.com/jorgebucaran/colorette). breakage is
possible but should be minimal.
* support for node < 8 has been dropped.

###### FEATURES

* throw on invalid style names ([`3b8072c`](https://github.com/citycide/logger-neue/commit/3b8072c84a08bc1ee13743dcc14d3d5219cc6cc0))
* replace chalk with colorette ([`c14c280`](https://github.com/citycide/logger-neue/commit/c14c280231b01ec79734dfc612c03cfdc341d82c))
* require node >= 8 ([`9e030b9`](https://github.com/citycide/logger-neue/commit/9e030b97c94867e9e3a94ecb17515c1e10fe804d))

###### PERFORMANCE

* drop `fs-extra` dependency ([`bcc2866`](https://github.com/citycide/logger-neue/commit/bcc2866ab533dca3bc75ac16b3094666bee7e491))

---

<a name="v2.2.0"></a>
### [`v2.2.0`](https://github.com/citycide/logger-neue/compare/v2.1.0...v2.2.0) (2019-01-04)


###### FEATURES

* add `padding` template variable, use as default ([`e7b1bed`](https://github.com/citycide/logger-neue/commit/e7b1bedc6d3d3dc6f82da3d21a3982d0f632bf3b))

---

<a name="v2.1.0"></a>
### [`v2.1.0`](https://github.com/citycide/logger-neue/compare/v2.0.1...v2.1.0) (2019-01-02)


###### FEATURES

* add `pre` events and support preventing logs ([`d57130d`](https://github.com/citycide/logger-neue/commit/d57130d2f523514c4f030eda0309cc558eaef0d5))

---

<a name="2.0.1"></a>
### `2.0.1` (2018-05-17)

This release fixes an issue that published out of date files to npm.

---

<a name="2.0.0"></a>
### `2.0.0` (2018-04-23)

v2.0.0 is a _significant_ release &mdash; `logger-neue` has been entirely rewritten
in strict TypeScript. On top of an improved API and providing a stronger developer
experience with its included type definitions, several minor potential bugs were
fixed during the rewrite.

Since this is a major release, there are several breaking changes:

* Minimum supported Node version of 6

* `import` usage

  The default export is now a _function_ rather than the `LoggerNeue` class &mdash;
  which is now a separate named export if you need it.

  ```ts
  import loggerNeue, { LoggerNeue } from 'logger-neue'

  const log = loggerNeue()
  const log2 = new LoggerNeue()
  ```

  However be aware that these are _not_ exactly equivalent for TypeScript users. The function
  is a wrapper around the class that serves to provide more accurate type definitions based
  on the level descriptors you provide at construction time.

  ```ts
  const log = loggerNeue({
    levels: {
      greet: [0, 'red']
    }
  })

  // you'll get type hints on this!
  log.greet('hi!')
  ```
* ES5 / commonjs `require`

  ES5 / commonjs users will need to use the `.default` property when `require`ing:

  ```js
  const loggerNeue = require('logger-neue').default
  ```

* level descriptors

  When defining new levels using object syntax, the property formerly known as `colors` is now
  called `style` to better reflect that [`chalk`](https://github.com/chalk/chalk#styles) styles
  other than colors such as `underline` and `bold` are also accepted.

###### FEATURES

* rewrite in TypeScript ([80dacc8](https://github.com/citycide/logger-neue/commit/80dacc8))

###### BREAKING CHANGES

* `colors` in level descriptor objects is now known as `style`.
* the default export is no longer a class, but instead is a function. The class is now a named export.
* non-ES module / TS users must use `require('logger-neue').default`.
* support for Node < 6 has been dropped.

---

<a name="1.0.0"></a>
### `1.0.0` (2017-08-03)

Initial stable release.

###### BUG FIXES

* default options when not provided ([36f51ef](https://github.com/citycide/logger-neue/commit/36f51ef))
* **console:** reorder definitions ([0b9e04c](https://github.com/citycide/logger-neue/commit/0b9e04c))


###### FEATURES

* improve primitive colorization ([cacf5fe](https://github.com/citycide/logger-neue/commit/cacf5fe))
* initial lightscript code ([08fd320](https://github.com/citycide/logger-neue/commit/08fd320))
* prevent setting path to a directory ([636060a](https://github.com/citycide/logger-neue/commit/636060a))
* seal default options, update lightscript code ([0459114](https://github.com/citycide/logger-neue/commit/0459114))
* use `fast-safe-stringify` for JSON handling ([c76d0b1](https://github.com/citycide/logger-neue/commit/c76d0b1))
* use babel `add-module-exports` ([54b057b](https://github.com/citycide/logger-neue/commit/54b057b))


###### BREAKING CHANGES

* `consoleLevel` and friends are no longer getters or setters and have been replaced by eg. `getConsoleLevel` methods.
