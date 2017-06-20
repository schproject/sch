/**
 * @flow
 */

import type {
    CommandSpec
} from '../../types';

import { builder } from '../../option';

const defaultOption = builder(String)
    .name('path')
    .build();

const spec: CommandSpec = { defaultOption };

export default spec;
