/**
 * @flow
 */

import type { Driver } from './driver/types';

export default class Log {
    driver: Driver;

    constructor (driver: Driver) {
        this.driver = driver;
    }
}
