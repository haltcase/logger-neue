'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (level, formatter, args) {
  let { colors, isError } = this.levels[level];

  let chalker = formatter.getChalkTemplate(colors);
  let context = formatter.createContext({ level, chalker, fullColor: this.console.fullColor }, args);
  let output = formatter.format(this.console.template, context);

  if (isError) {
    if (typeof window !== 'undefined') {
      // basic browser support for Electron
      let target = console && console.error || (() => {});
      target(`${ level }: `, ...args);
    } else {
      process.stderr.write(output + _os2.default.EOL);
    }
  } else {
    if (typeof window !== 'undefined') {
      // basic browser support for Electron
      let target = console && (console[level] || console.log);
      target(`${ level }: `, ...args);
    } else {
      process.stdout.write(output + _os2.default.EOL);
    }
  }
};

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }