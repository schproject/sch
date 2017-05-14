/**
 * @flow
 */

import type { Command, Process } from '../types';

export default class Init implements Command {
    run (process: Process) {
        const { argv } = process,
            path = argv.length > 0
                ? argv[argv.length - 1]
                : process.cwd();
    }
}
