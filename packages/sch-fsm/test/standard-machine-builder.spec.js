/**
 * @flow
 */

import { expect } from 'chai';
import sinon from 'sinon';

import { DuplicateStateIdError, MissingInitialStateError, MultipleInitialStatesError } from '../src/errors';
import type { MachineBuilder, State, StateId } from '../src/types';
import { StandardState } from '../src/state';
import { StandardMachineBuilder } from '../src/machine';
import { TestContext, configure } from './util';

describe('StandardMachineBuilder', function() {
    let contextClass: Class<TestContext> = TestContext,
        machineBuilder: MachineBuilder<TestContext>;

    beforeEach(function() {
        machineBuilder = new StandardMachineBuilder(contextClass);
    });

    describe('#build', function() {
        context('when an initial state has not been provided', function() {
            const stateId: StateId = 'some-state-id',
                state: State<TestContext>
                    = configure(sinon.createStubInstance(StandardState), function(stub) {
                        stub.id.returns(stateId);
                        stub.initial.returns(false);
                    });

            beforeEach(function() {
                machineBuilder.state(state);
            });

            it('throws a MissingInitialStateError', function() {
                expect(() => machineBuilder.build())
                    .to.throw(MissingInitialStateError);
            });
        });
    });

    describe('#state', function() {
        context('when a previously provided state declared itself as initial', function() {
            const stateId1: StateId = 'some-state-id-1',
                stateId2: StateId = 'some-state-id-2',
                state1: State<TestContext>
                    = configure(sinon.createStubInstance(StandardState), function(stub) {
                        stub.id.returns(stateId1);
                        stub.initial.returns(true);
                    }),
                state2: State<TestContext>
                    = configure(sinon.createStubInstance(StandardState), function(stub) {
                        stub.id.returns(stateId2);
                        stub.initial.returns(true);
                    });

            beforeEach(function() {
                machineBuilder.state(state1);
            });

            it('throws a MultipleInitialStatesError', function() {
                expect(() => machineBuilder.state(state2))
                    .to.throw(MultipleInitialStatesError);
            });
        });

        context('when another state with the same id has already been provided to the builder', function() {
            const stateId: StateId = 'some-state-id',
                state: State<TestContext>
                    = configure(sinon.createStubInstance(StandardState), function(stub) {
                        stub.id.returns(stateId);
                    });

            beforeEach(function() {
                machineBuilder.state(state);
            });

            it('throws a DuplicateStateIdError', function() {
                expect(() => machineBuilder.state(state)).throw(DuplicateStateIdError);
            });
        });

        it('accepts multiple states as long as there are no duplicates initials or state ids', function() {
            machineBuilder.state(configure(sinon.createStubInstance(StandardState), function(stub) {
                stub.id.returns('state-id-1');
                stub.initial.returns(true);
            }));

            machineBuilder.state(configure(sinon.createStubInstance(StandardState), function(stub) {
                stub.id.returns('state-id-2');
                stub.initial.returns(false);
            }));
        });
    });
});
