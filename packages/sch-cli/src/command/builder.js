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

    flag (option: Option<*>): LineSpecBuilder {
        this._flags.set(option.name, option);
        return this;
    }
}

class OptionBuilder<T: OptionType> {
    _defaultValue: T | (Process => T);
    _name: string;
    _multiple: boolean;
    _optional: boolean;
    _sample: T;

    constructor (name: string, sample: T) {
        this._name = name;
        this._sample = sample;
    }

    build (): Option<T> {
        const spec: Option<T> = {
            defaultValue: this._defaultValue,
            multiple: this._multiple,
            name: this._name,
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
    boolean (name: string): OptionBuilder<boolean> {
        return new OptionBuilder(name, true);
    },

    number (name: string): OptionBuilder<number> {
        return new OptionBuilder(name, 0);
    },

    string (name: string): OptionBuilder<string> {
        return new OptionBuilder(name, '');
    }
}
