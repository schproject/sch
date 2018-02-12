/**
 * @flow
 */

import { expect } from 'chai';
import sinon from 'sinon';

import { DuplicateStateIdError, IllegalTransitionError,
    MissingInitialStateError, MultipleInitialStatesError } from '../src/errors';
import type { Machine, MachineBuilder, State, StateId } from '../src/types';
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
        context('when all components have been provided and are valid', function() {
            const stateId1: StateId = 'some-state-id-1',
                stateId2: StateId = 'some-state-id-2',
                state1: State<TestContext>
                    = configure(sinon.createStubInstance(StandardState), function(stub) {
                        stub.id.returns(stateId1);
                        stub.initial.returns(true);
                        stub.transitionsTo.returns([stateId2]);
                    }),
                state2: State<TestContext>
                    = configure(sinon.createStubInstance(StandardState), function(stub) {
                        stub.id.returns(stateId2);
                        stub.initial.returns(false);
                        stub.transitionsTo.returns([stateId1]);
                    });

            let machine: Machine<TestContext>;

            beforeEach(function() {
                machineBuilder.state(state1).state(state2);
            });

            it('returns a machine', function() {
                machine = machineBuilder.build();
            });

            describe('the machine', function() {
                describe('#initialState', function() {
                    it('is equal to the initial state provided to the machine builder', function() {
                        expect(machine.initialState()).to.equal(state1);
                    });
                });

                describe('#states', function() {
                    it('contains all and only the states provided to the machine builder', function() {
                        const states = machine.states();

                        expect(states).to.have.lengthOf(2);
                        expect(states[0]).to.equal(state1);
                        expect(states[1]).to.equal(state2);
                    });
                });
            });
        });

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

        context('when a state transitions to state id that identifies a unknown state', function() {
            const stateId: StateId = 'some-state-id',
                state: State<TestContext>
                    = configure(sinon.createStubInstance(StandardState), function(stub) {
                        stub.id.returns(stateId);
                        stub.initial.returns(true);
                        stub.transitionsTo.returns(['some-unknown-state-id']);
                    });

            beforeEach(function() {
                machineBuilder.state(state);
            });

            it('throws an IllegalTransitionError', function() {
                expect(() => machineBuilder.build())
                    .to.throw(IllegalTransitionError);
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
