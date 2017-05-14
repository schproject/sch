/**
 * @flow
 */

import Registry from '../registry';

import Init from './init';
import Status from './status';
import Use from './use';

export default class Log extends Registry {
    constructor () {
        const status = new Status();

        super({
            'default': status,
            init: new Init(),
            status: status,
            use: new Use()
        });
    }
}
