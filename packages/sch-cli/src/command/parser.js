/**
 * @flow
 */

import {
    MissingOptionArgumentError,
    ParserError
} from './errors';

import type {
    LineSpec,
    Option,
    OptionType
} from './types';

class Parser<T: OptionType> {
    option: Option<T>;
    refiner: Refiner<T>;
    value: T | Array<T>;

    constructor (option: Option<T>) {
        this.option = option;
        this.refiner = new Refiner(this, option.sample);

        if (option.multiple) {
            this.value = (this.refiner.switch({
                boolean: (_) => ([]: Array<boolean>),
                number: (_) => ([]: Array<number>),
                string: (_) => ([]: Array<string>)
            }): Array<T>);
        }
    }

    parse (value: string): Parser<T> {
        const typedValue = this.refiner.cast(value);

        if (this.value instanceof Array) {
            this.value.push(typedValue);
        } else {
            this.value = typedValue;
        }

        return this;
    }

    result () {
        return this.value instanceof Array
            ? this.value.slice()
            : this.value;
    }
}

class Refiner<T: OptionType> {
    context: any;
    type: string;

    constructor (context: any, sample: T) {
        this.context = context;
        this.type = typeof sample;
    }

    cast (value: string): T {
        return this.switch({
            boolean: value => value,
            number: value => value,
            string: value => value
        }, value);
    }

    switch (callbacks: {
                'boolean': boolean => *,
                'number': number => *,
                'string': string => *
            }, value?: string): * {
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

export function parse (args: Array<string>, lineSpec: LineSpec): any {
    const errors: Array<ParserError<*>> = [],
        parsers: Map<string, Parser<*>> = new Map(); 

    // Parse all args
    const copyOfArgs = args.slice(),
        finalArgs = [],
        lastOptions: Array<Option<*>> = [];

    let arg;
    while(arg = copyOfArgs.shift()) {
        let lastOption: ?Option<*> = lastOptions.shift();

        // We have a new flag
        if (arg.startsWith('-')) {
            const option: Option<*> = lineSpec.flags[arg];

            if (!option) {
                // This flag is not recognized!
                console.warn('Flag', arg, 'is not recognized');
            }
            
            if (lastOption) {
                if (lastOption.sample != typeof true) {
                    console.warn('No value was set for non-boolean flag', lastOption.name);
                } else {
                    parsers.set(arg, new Parser(option));
                    lastOptions.push(option);
                }
            }
        // We have a(n) (flag) argument
        } else {
            if (lastOption) {
                const parser: ?Parser<*> = parsers.get(lastOption.name);

                if (!parser) {
                    // This is an illegal state!
                } else {
                    parser.parse(arg);
                }
            } else {
            }
        }
    }

    if(lastOptions.length) {
        // This is an illegal state!
    }

    const result = Array.from(parsers.keys())
        .reduce(function (result: { [key: string]: any }, key: string) {
            const parser: ?Parser<*> = parsers.get(key);

            if (parser) {
                result[key] = parser.result();
            }

            return result;
        }, {});

    return result;
}
