'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logFormat = exports.format = undefined;
exports.getChalkTemplate = getChalkTemplate;
exports.createContext = createContext;

var _strat = require('strat');

var _strat2 = _interopRequireDefault(_strat);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _helpers = require('./helpers');

var helpers = _interopRequireWildcard(_helpers);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let format = exports.format = _strat2.default.create({
  upper: str => String(str).toUpperCase(),
  lower: str => String(str).toLowerCase(),
  paren: str => `(${ str })`,
  brace: str => `[${ str }]`,
  curly: str => `{${ str }}`,
  json: str => JSON.stringify(str)
});

let logFormat = exports.logFormat = {
  standard: format('{level}: {input}'),
  get template() {
    return this.custom || this.standard;
  },
  set template(value) {
    this.custom = format(value);
  }
};

function getChalkTemplate(colors) {
  return colors.reduce((acc, color) => {
    return typeof acc[color] === 'function' ? acc[color] : acc.white;
  }, _chalk2.default);
}

function createContext(state, args) {
  let { chalker, level, fullColor } = state;

  return {
    args,
    level: () => chalker(level),
    timestamp: () => new Date().toISOString(),
    input: () => {
      return args.reduce((acc, cur, i) => {
        return acc + (i ? ' ' : '') + formatInput(fullColor, cur);
      }, '');
    }
  };
}

function formatInput(fullColor, value) {
  if (helpers.isObject(value) || Array.isArray(value)) {
    return _util2.default.inspect(value, { colors: fullColor });
  }

  return fullColor ? _util2.default.inspect(value, { colors: true }) : value;
}