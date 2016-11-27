'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (level, formatter, args) {
  let logPath = _path2.default.resolve(this.file.dir, this.file.path);

  _fsPromise2.default.ensureDir(_path2.default.dirname(logPath)).then(() => {
    let context = formatter.createContext({ level, chalker: val => val }, args);
    let output = formatter.format(this.file.template, context);

    let stream = _fsPromise2.default.createWriteStream(logPath, { flags: 'a' });
    stream.write(output + _os2.default.EOL);
    stream.on('error', e => this.emit('error', e));
  });
};

var _fsPromise = require('fs-promise');

var _fsPromise2 = _interopRequireDefault(_fsPromise);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }