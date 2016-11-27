'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FILE = exports.CONSOLE = exports.LEVELS = undefined;
exports.normalizeLevels = normalizeLevels;

var _helpers = require('./helpers');

var helpers = _interopRequireWildcard(_helpers);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const LEVELS = exports.LEVELS = {
  error: {
    level: 0,
    colors: ['red', 'bgBlack']
  },
  warn: {
    level: 1,
    colors: ['black', 'bgYellow']
  },
  info: {
    level: 2,
    colors: ['green']
  },
  verbose: {
    level: 3,
    colors: ['blue', 'bgBlack']
  },
  debug: {
    level: 4,
    colors: ['cyan']
  },
  silly: {
    level: 5,
    colors: ['inverse']
  }
};

const CONSOLE = exports.CONSOLE = {
  level: 0,
  levels: LEVELS,
  fullColor: false,
  template: '{level}: {input}'
};

const FILE = exports.FILE = {
  dir: process.cwd(),
  level: 0,
  levels: LEVELS,
  template: '{{"level":{level!json},"input":{args!json},"timestamp":{timestamp!json}}}'
};

function normalizeLevels(levels) {
  if (levels == null) return LEVELS;

  if (!helpers.isObject(levels)) {
    throw new TypeError(`expected 'options.levels' to be an Object`);
  }

  return Object.keys(levels).reduce((acc, cur) => {
    let element = levels[cur];
    if (Array.isArray(element)) {
      acc[cur] = {
        level: Number(element[0]) || 0,
        colors: Array.isArray(element[1]) ? element[1] : [element[1]]
      };

      return acc;
    } else if (helpers.isObject(element)) {
      if (helpers.hasProps(element, ['level', 'colors'])) {
        acc[cur] = {
          level: Number(element.level) || 0,
          colors: Array.isArray(element.colors) ? element.colors : [element.colors]
        };

        return acc;
      }
    } else {
      throw new TypeError(`invalid level definition for 'options.levels.${ cur }'`);
    }
  }, {});
}