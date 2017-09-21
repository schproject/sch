/**
 * @flow
 */

import type { Command, CommandSpec } from 'sch-cli-opts';
import type { Process } from 'sch-common';
import { specBuilder } from 'sch-cli-opts';

export const command: Command = {
    run (process: Process) {}
};

export const spec: CommandSpec =  specBuilder.command()
    .arg('path', specBuilder.option.string()
        .defaultValue(({ cwd }: Process) => cwd())
        .build())
    .flag('-store-config', specBuilder.option.string().multiple().build())
    .flag('-store-type', specBuilder.option.string().build())
    .build();

export default {
    command,
    spec
}
