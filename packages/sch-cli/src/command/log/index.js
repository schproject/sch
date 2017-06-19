/**
 * @flow
 */

import Registry, {
    DEFAULT_KEY
} from '../registry';

import init from './init';

const entries = { init };

export default new Registry(entries);
