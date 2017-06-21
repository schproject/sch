/**
 * @flow
 */

import type { Option } from './types';
import type { Process } from '../types';

class OptionBuilder<T: boolean | number | string> {
    _defaultValue: T | (Process => T);
    _last: boolean;
    _multiple: boolean;
    _optional: boolean;
    _name: string;
    _type: T;

    constructor (type: T) {
        this._type = type;
    }

    build (): Option<T> {
        const spec: Option<T> = {
            defaultValue: this._defaultValue,
            last: this._last,
            multiple: this._multiple,
            name: this._name,
            optional: this._optional,
            type: this._type,
        }

        return spec;
    }

    defaultValue (defaultValue: T | (Process => T)): OptionBuilder<T> {
        this._defaultValue = defaultValue;
        return this;
    }

    last (last: boolean = true): OptionBuilder<T> {
        this._last = last;
        return this;
    }

    multiple (multiple: boolean = true): OptionBuilder<T> {
        this._multiple = multiple;
        return this;
    }

    name (name: string): OptionBuilder<T> {
        this._name = name;
        return this;
    }

    optional (optional: boolean = true): OptionBuilder<T> {
        this._optional = optional;
        return this;
    }
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
