/**
 * @flow
 */

import type { Command } from '../types';
import type { Process } from '../../types';
import {
    lineSpec,
    option
} from '../builder';

const init: Command = {
    lineSpec: lineSpec()
        .arg(option.string()
            .defaultValue(({ cwd }: Process) => cwd())
            .build())
        .flag('-store-config',
            option.string()
                .multiple()
                .build())
        .flag('-store-type',
            option.string()
                .build())
        .build(),
    run (process: Process) {}
};

console.log(init);

export default init;
