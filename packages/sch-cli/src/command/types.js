/**
 * @flow
 */

import type { Process } from '../types';

export type ParsedArgMultipleValue
    = Array<boolean> | Array<number> | Array<string>;
export type ParsedArgSingleValue = boolean | number | string;
export type ParsedArgValue = ParsedArgMultipleValue | ParsedArgSingleValue;

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
