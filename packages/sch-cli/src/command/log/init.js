/** * @flow
 */

import type { Command } from '../types';
import type { Process } from '../../types';

const init: Command = {
    run (process: Process) {
        const { argv } = process,
            path = argv.length > 0
                ? argv[argv.length - 1]
                : process.cwd();
    }
};

export default init;
