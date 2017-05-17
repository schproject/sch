"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = init;


/*
 * Want to be able to support multiple driver types, e.g.
 *
 * gdrive://path/to/log
 * file:///x/y/z
 * dropbox:///...
 *
 * Want to be able to have users specify precisely the log
 * driver they want to user, e.g.
 *
 * log = new Log(driver, path);
 *
 * and have the log detect the type automatically
 *
 * log = Log.use(...)
 * log = Log.init(...)
 */
function init(path) {}