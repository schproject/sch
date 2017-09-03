/**
 * @flow
 */

import type { LineSpec } from '../parser';
import type { Process } from '../types';

export interface Command {
    lineSpec: LineSpec;
    run (process: Process): void;
}
