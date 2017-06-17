/**
 * @flow
 */

import Registry from './registry';

import Log from './log';
import Res from './res';

export const registry = new Registry({
    log: new Log(),
    res: new Res()
});
