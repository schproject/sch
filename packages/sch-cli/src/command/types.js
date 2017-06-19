/**
 * @flow
 */

import type { Process } from '../types';

export interface Command {
    run (process: Process): void;
    spec: CommandSpec;
}

export interface CommandSpec {
    defaultOption?: OptionSpec<*>;
    options?: Array<OptionSpec<*>>;
}

export type DefaultValue<T> = T | DefaultValueSupplier<T>;

type DefaultValueSupplier<T> = (Process) => T;

export interface OptionSpec<T: Boolean | Number | String> {
    defaultValue?: DefaultValue<T>;
    optional?: boolean;
    multiple?: boolean;
    name: string;
    type: Class<T>;
}
