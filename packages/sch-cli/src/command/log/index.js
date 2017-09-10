/**
 * @flow
 */

import {
    GroupSpec,
    specBuilder
} from '../../spec';

import init from './init';

export const spec: GroupSpec = specBuilder.group()
    .command('init', init.spec)
    .build()

export default { spec }
