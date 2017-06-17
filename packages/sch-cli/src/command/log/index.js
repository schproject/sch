/**
 * @flow
 */

import Registry, {
    DEFAULT_KEY
} from '../registry';

import init from './init';
import status from './status';
import use from './use';

const entries = { };

entries[DEFAULT_KEY] = status;
entries.init = init;
entries.status = status;
entries.use = use;

export default new Registry(entries);
