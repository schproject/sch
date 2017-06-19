/**
 * @flow
 */

import type { Process } from '../../../types';

export default function run (process: Process) {
    const { argv } = process,
        path = argv.length > 0
            ? argv[argv.length - 1]
            : process.cwd();
}
