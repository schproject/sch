/**
 * @flow
 */

export class TestContext {}

export function configure<T>(x: T, configurator: (y: T) => void): T {
    configurator(x);
    return x;
}
