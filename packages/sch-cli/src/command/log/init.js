/**
 * @flow
 */

import type { Command } from '../types';
import type { Process } from '../../types';
import { option } from '../builder';

const path = option.string()
    .defaultValue(({ cwd }: Process) => cwd())
    .name('path')
    .build();

function run () {}

const init: Command = {
    options: [ path ],
    run
};

export default init;
