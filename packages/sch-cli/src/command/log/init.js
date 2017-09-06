/**
 * @flow
 */

import type { Command } from '../types';

import type { Process } from '../../types';

import {
    CommandSpecBuilder,
    OptionSpecBuilder
} from '../../spec';

const init: Command = {
    commandSpec: CommandSpecBuilder.new('init')
        .arg(OptionSpecBuilder.string('path')
            .defaultValue(({ cwd }: Process) => cwd())
            .build())
        .flag(OptionSpecBuilder.string('-store-config')
            .multiple()
            .build())
        .flag(OptionSpecBuilder.string('-store-type')
            .build())
        .build(),
    run (process: Process) {}
};

export default init;
