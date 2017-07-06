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
        .arg(option.string('path')
            .defaultValue(({ cwd }: Process) => cwd())
            .build())
        .flag(option.string('-store-config')
                .multiple()
                .build())
        .flag(option.string('-store-type')
                .build())
        .build(),
    run (process: Process) {}
};

console.log(init);

export default init;
