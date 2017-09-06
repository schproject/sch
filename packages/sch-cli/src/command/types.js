/**
 * @flow
 */

import type { CommandSpec } from '../spec';
import type { Process } from '../types';

export interface Command {
    commandSpec: CommandSpec;
    run (process: Process): void;
}
