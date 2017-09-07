/**
 * @flow
 */

import {
    GroupSpec,
    specBuilder
} from '../../spec';

import init from './init';

export const spec: GroupSpec = specBuilder.group('log')
    .command(init.spec)
    .build()

export default { spec }
