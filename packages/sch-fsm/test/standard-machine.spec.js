/**
 * @flow
 */

import { expect } from 'chai';
import sinon from 'sinon';

import type { Machine, State } from '../src/types';
import { StandardMachine } from '../src/machine';
import { StandardState } from '../src/state';
import { TestContext } from './util';

describe('StandardMachine', function() {
    let contextClass: Class<TestContext> = TestContext,
        initialState: State<TestContext>
            = sinon.createStubInstance(StandardState),
        machine: Machine<TestContext>,
        states: $ReadOnlyArray<State<TestContext>> = [];

    beforeEach(function() {
        machine = new StandardMachine(contextClass, initialState, states);
    });

    describe('#run', function() {
    });
});
