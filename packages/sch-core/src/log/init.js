/**
 * @flow
 */

/*
 * Want to be able to support multiple store types, e.g.
 *
 * gdrive://path/to/log
 * file:///x/y/z
 * dropbox:///...
 *
 * Want to be able to have users specify precisely the log
 * store they want to user, e.g.
 *
 * log = new Log(store, path);
 *
 * and have the log detect the type automatically
 *
 * log = Log.use(...)
 * log = Log.init(...)
 */
export default function init (path: string) {
}
