/**
 * @flow
 */

import type { Process } from '../types';

export interface Command {
    lineSpec: LineSpec;
    run (process: Process): void;
}

export interface LineSpec {
    arg: Option<*>;
    flags: { [name: string]: Option<*> };
}

export interface Option<T: OptionType> {
    defaultValue: T | (Process => T);
    multiple: boolean;
    optional: boolean;
    sample: T;
}

export type OptionType = boolean | number | string;
