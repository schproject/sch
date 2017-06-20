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

export interface OptionSpec<T: Boolean | Number | String> {
    defaultValue?: T;
    multiple?: boolean;
    name: string;
    optional?: boolean;
    type: Class<T>;
}
