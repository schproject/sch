/**
 * @flow
 */

import Registry from './registry';

import Log from './log';
import Res from './res';

const registry = new Registry({
    log: new Log(),
    res: new Res()
});

export default registry;
