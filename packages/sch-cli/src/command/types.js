/**
 * @flow
 */

import type { Process } from '../types';

export interface Command {
    run (process: Process): void;
    options: Array<Option<*>>;
}

export interface Option<T: boolean | number | string> {
    defaultValue?: T | (Process => T);
    last?: boolean;
    multiple?: boolean;
    name: string;
    optional?: boolean;
    type: T;
}
