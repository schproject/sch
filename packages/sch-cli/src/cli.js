/**
 * @flow
 */

import command from './command';
import type { Process } from './command/types';

export function run (process: Process) {
    command.run({
        argv: process.argv.slice(2),
        cwd: process.cwd,
        env: process.env
    });
}
