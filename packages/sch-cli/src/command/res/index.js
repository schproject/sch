/**
 * @flow
 */

import Registry from '../registry';

import Add from './add';

export default class Res extends Registry {
    constructor () {
        super({
            add: new Add()
        });
    }
}
