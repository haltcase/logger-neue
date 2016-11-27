'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assignDeep = require('assign-deep');

var _assignDeep2 = _interopRequireDefault(_assignDeep);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _transports = require('./transports');

var _transports2 = _interopRequireDefault(_transports);

var _helpers = require('./helpers');

var helpers = _interopRequireWildcard(_helpers);

var _defaults = require('./defaults');

var defaults = _interopRequireWildcard(_defaults);

var _formatter = require('./formatter');

var formatter = _interopRequireWildcard(_formatter);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class LoggerNeue extends _events2.default {
  constructor(options = defaults) {
    super();

    if (options && !helpers.isObject(options)) {
      throw new TypeError('options must be an object');
    }

    this.file = options.file && options.file.path ? (0, _assignDeep2.default)({}, defaults.FILE, options.file) : false;

    this.console = (0, _assignDeep2.default)({}, defaults.CONSOLE, options.console);
    this.levels = defaults.normalizeLevels(options.levels);

    if (this.file) {
      this.fileLevel = this.file.level;
    }
    this.consoleLevel = this.console.level;

    Object.keys(this.levels).map(name => {
      let { level, colors } = this.levels[name];
      this.addLevel(name, level, colors);
    });
  }

  static create(options) {
    return new LoggerNeue(options);
  }

  addLevel(name, level, colors) {
    this.levels[name] = { level, colors };

    if (!this[name]) {
      this[name] = (...args) => {
        this.log(name, ...args);
      };

      this[name].format = (template, ...args) => {
        if (args.length === 1) {
          let obj = args[0];
          if (obj === Object(obj)) {
            args = obj;
          }
        }
        this.log(name, formatter.format(template, args));
      };
    }
  }

  log(level, ...args) {
    let action, number, logged;

    if (typeof level === 'string') {
      if (!(level in this.levels)) {
        throw new Error(`no such log level is defined ('${ level }')`);
      }

      action = level;
      number = this.levels[level].level;
    } else {
      let res = this.getLevelByNumber(level);
      if (!res) {
        throw new Error(`could not find a log name for level ${ level }`);
      }

      action = res;
      number = level;
    }

    if (this.consoleLevel >= number) {
      _transports2.default.console.call(this, action, formatter, args);
      logged = true;
    }

    if (this.file && this.fileLevel >= number) {
      _transports2.default.file.call(this, action, formatter, args);
      logged = true;
    }

    if (logged) {
      let props = { name: action, level: number, args };
      this.emit('log', props);
      this.emit(`log:${ action }`, props);
    }
  }

  getLevelByNumber(n) {
    return Object.keys(this.levels).reduce((_, name) => {
      let { level } = this.levels[name] || {};
      if (level === n) return name;
    });
  }

  getNumberOfLevel(name) {
    return (this.levels[name] || {}).level;
  }

  get levelNames() {
    return Object.keys(this.levels);
  }

  get consoleLevel() {
    return this.console.level;
  }

  set consoleLevel(level) {
    if (typeof level === 'string') {
      this.console.level = Number(this.getNumberOfLevel(level)) || 0;
    } else {
      this.console.level = Number(level) || 0;
    }
  }

  get fileLevel() {
    return this.file.level;
  }

  set fileLevel(level) {
    if (typeof level === 'string') {
      this.file.level = Number(this.getNumberOfLevel(level)) || 0;
    } else {
      this.file.level = Number(level) || 0;
    }
  }
}

exports.default = LoggerNeue;