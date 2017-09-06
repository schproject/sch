/**
 * @flow
 */

import type { Command } from '../types';

import type { Process } from '../../types';

import {
    CommandSpec,
    specBuilder
} from '../../spec';

export const spec: CommandSpec =  specBuilder.command
    .named('init')
    .arg(specBuilder.option
        .string('path')
        .defaultValue(({ cwd }: Process) => cwd())
        .build())
    .flag(specBuilder.option
        .string('-store-config')
        .multiple()
        .build())
    .flag(specBuilder.option
        .string('-store-type')
        .build())
    .build();

export default {
    spec
}
