/**
 * @flow
 */

import type { Command } from '../types';

import type { Process } from '../../types';

import {
    CommandSpec,
    specBuilder
} from '../../spec';

export const command: Command = {
    run (process: Process) {}
};

export const spec: CommandSpec =  specBuilder.command()
    .arg('path', specBuilder.option.string()
        .defaultValue(({ cwd }: Process) => cwd())
        .build())
    .flag('-store-config', specBuilder.option.string().multiple().build())
    .flag('-option-type', specBuilder.option.string().build())
    .build();

export default {
    command,
    spec
}
