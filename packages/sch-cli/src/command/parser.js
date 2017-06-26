/**
 * @flow
 */

import { IllegalOptionSampleType } from './errors';

import type {
    LineSpec,
    Option,
    OptionType,
    ParsedArgMultipleValue,
    ParsedArgValue
} from './types';

class Parser<T: OptionType> {
    option: Option<T>;
    refiner: Refiner<T>;
    value: ParsedArgValue;

    constructor (option: Option<T>) {
        this.option = option;
        this.refiner = new Refiner(this, option.sample);

        if (option.multiple) {
            this.value = (this.refiner.refine({
                boolean: (_) => ([]: Array<boolean>),
                number: (_) => ([]: Array<number>),
                string: (_) => ([]: Array<string>)
            }): ParsedArgMultipleValue);
        }
    }

    parse (value: string): Parser<T> {
        return this;
    }
}

class Refiner<T: OptionType> {
    context: any;
    type: string;

    constructor (context: any, sample: T) {
        this.context = context;
        this.type = typeof sample;
    }

    refine (callbacks: {
                'boolean': boolean => any,
                'number': number => any,
                'string': string => any
            }, value?: string): any {
        switch (this.type) {
            case 'boolean':
                return callbacks.boolean
                    .bind(this.context)((new Boolean(value)).valueOf());
            case 'number':
                return callbacks.number
                    .bind(this.context)((new Number(value)).valueOf());
            case 'string':
                return callbacks.string
                    .bind(this.context)((new String(value)).valueOf());
        }
    }
}
