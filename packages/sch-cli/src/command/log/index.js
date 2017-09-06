/**
 * @flow
 */

import {
    NamedGroupSpec,
    specBuilder
} from '../../spec';

import init from './init';

export const spec: NamedGroupSpec = specBuilder.group
    .named('log')
    .command(init.spec)
    .build()

export default { spec }
