/**
 * @flow
 */

import type { Store } from '../store/types';

export default class Log {
    store: Store;

    constructor (store: Store) {
        this.store = store;
    }
}
