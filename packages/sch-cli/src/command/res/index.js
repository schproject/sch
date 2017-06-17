/**
 * @flow
 */

import Registry from '../registry';

import add from './add';

const registry = new Registry({ add });

export default registry;
