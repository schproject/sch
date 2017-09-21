/**
 * @flow
 */

export interface Registry<T> {
    +find: (...name: Array<string>) => ?T;
}

export interface RegistryBuilder<T> {
    +build: (void) => Registry<T>;
    +default: (entry: T) => RegistryBuilder<T>;
    +entry: (name: string, entry: T) => RegistryBuilder<T>;
    +registry: (name: string, registry: Registry<T>) => RegistryBuilder<T>;
}
