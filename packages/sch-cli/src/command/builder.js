/**
 * @flow
 */

import type {
    LineSpec,
    Option,
    OptionType
} from './types';
import type { Process } from '../types';

class LineSpecBuilder {
    _arg: Option<*>;
    _flags: Map<string, Option<*>>;

    constructor () {
        this._flags = new Map();
    }

    arg (arg: Option<*>): LineSpecBuilder {
        this._arg = arg;
        return this;
    }

    build (): LineSpec {
        const lineSpec: LineSpec = {
            arg: this._arg,
            flags: Array.from(this._flags).reduce((obj, [key, value]) => {
                obj[key] = value;
                return obj;
            }, {})
        };

        return lineSpec;
    }

    flag (name: string, option: Option<*>): LineSpecBuilder {
        this._flags.set(name, option);
        return this;
    }
}

class OptionBuilder<T: OptionType> {
    _defaultValue: T | (Process => T);
    _multiple: boolean;
    _optional: boolean;
    _sample: T;

    constructor (sample: T) {
        this._sample = sample;
    }

    build (): Option<T> {
        const spec: Option<T> = {
            defaultValue: this._defaultValue,
            multiple: this._multiple,
            optional: this._optional,
            sample: this._sample,
        }

        return spec;
    }

    defaultValue (defaultValue: T | (Process => T)): OptionBuilder<T> {
        this._defaultValue = defaultValue;
        return this;
    }

    multiple (multiple: boolean = true): OptionBuilder<T> {
        this._multiple = multiple;
        return this;
    }

    optional (optional: boolean = true): OptionBuilder<T> {
        this._optional = optional;
        return this;
    }
}

export function lineSpec () {
    return new LineSpecBuilder();
}

export const option = {
    boolean (): OptionBuilder<boolean> {
        return new OptionBuilder(true);
    },

    number (): OptionBuilder<number> {
        return new OptionBuilder(0);
    },

    string (): OptionBuilder<string> {
        return new OptionBuilder('');
    }
}
