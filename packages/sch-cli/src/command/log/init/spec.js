/**
 * @flow
 */

import type {
    CommandSpec,
    DefaultValue,
    OptionSpec
} from '../../types';

const defaultOptionValue: DefaultValue<String> = ({ cwd }) => new String(cwd());

const defaultOption: OptionSpec<String> = {
    defaultValue: defaultOptionValue,
    name: 'path',
    type: String
};

const spec: CommandSpec = { defaultOption };

export default spec;
