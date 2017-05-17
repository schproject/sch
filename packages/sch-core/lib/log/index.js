'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _log = require('./log');

Object.keys(_log).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _log[key];
    }
  });
});