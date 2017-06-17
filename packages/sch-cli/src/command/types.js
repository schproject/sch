/**
 * @flow
 */

import type { Process } from '../types';

export interface Command {
    run (process: Process): void;
}
