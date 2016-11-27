"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isObject = isObject;
exports.hasProps = hasProps;
function isObject(value) {
  return value === Object(value) && !Array.isArray(value);
}

function hasProps(object, keys) {
  return keys.every(key => ({}).hasOwnProperty.call(object, key));
}