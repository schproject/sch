/**
 * @flow
 */

export interface Registry<T> {
    +getDefault: (void) => T;
    +getEntry: (name: string) => T;
    +getRegistry: (name: string) => Registry<T>;
    +hasDefault: () => boolean;
    +hasEntry: (name: string) => boolean;
    +hasRegistry: (name: string) => boolean;
}

export interface RegistryBuilder<T> {
    +build: (void) => Registry<T>;
    +default: (entry: T) => RegistryBuilder<T>;
    +entry: (name: string, entry: T) => RegistryBuilder<T>;
    +registry: (name: string, registry: Registry<T>) => RegistryBuilder<T>;
}
