/**
 * @flow
 */

import Registry from '../registry';

import Init from './init';
import Use from './use';

export default class Log extends Registry {
    constructor () {
        super({
            init: new Init(),
            use: new Use()
        });
    }
}
