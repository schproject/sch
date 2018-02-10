/**
 * @flow
 */

import { expect } from 'chai';
import sinon from 'sinon';

import { IllegalStateError } from '../src/errors';
import type { State, StateBuilder, StateId, StateIdRegistry,
    Transition, TransitionFactory } from '../src/types';
import { StandardState, StandardStateBuilder } from '../src/state';
import { TestContext } from './util';

describe('StandardStateBuilder', function () {
    let contextClass: Class<TestContext> = TestContext,
        stateBuilder: StateBuilder<TestContext>,
        stateId: StateId = 'some-state-id',
        transition: Transition<TestContext> = sinon.stub(),
        transitionFactory: TransitionFactory<TestContext>
            = sinon.stub().returns(transition);

    beforeEach(function () {
        stateBuilder = new StandardStateBuilder(TestContext);
    });

    describe('#build', function () {
        context('when all required components have been supplied', function() {
            let state: State<TestContext>;

            beforeEach(function() {
                state = stateBuilder.id(stateId)
                    .transition(transitionFactory)
                    .build();
            });

            it('returns a state', function() {
                expect(state).to.not.be.null;
            });

            describe('the state', function() {
                describe('#id', function() {
                    it('is equal to the state id value provided to the state builder', function() {
                        expect(state.id()).to.equal(stateId);
                    });
                });

                describe('#transition', function() {
                    it('is equal to the transition created by the supplied transition factory', function() {
                        expect(state.transition()).to.equal(transition);
                    });
                });

                describe('#transitionsTo', function() {
                    const stateNames: Array<string> = ['some-state-1', 'some-state-2'],
                        stateIds: Array<StateId> = [];

                    before(function() {
                        transitionFactory.callsFake(function(stateIdRegistry: StateIdRegistry) {
                            stateNames.forEach(name => {
                                stateIds.push(stateIdRegistry.get(name));
                            });

                            return transition;
                        });
                    });

                    it('returns all and only the states registered by the transition factory', function() {
                        expect(state.transitionsTo()).to.have.lengthOf(stateIds.length);
                        state.transitionsTo().forEach((stateId, i) => {
                            expect(stateId).to.equal(stateIds[i]);
                        });
                    });
                });
            });
        });

        context('when no id has been supplied', function() {
            beforeEach(function() {
                stateBuilder.transition(transitionFactory);
            });

            it('throws an IllegalStateError', function() {
                expect(() => stateBuilder.build())
                    .to.throw(IllegalStateError, 'Cannot build a state without an id');
            });
        });

        context('when no transition has been supplied', function() {
            beforeEach(function() {
                stateBuilder.id(stateId);
            });

            it('throws an IllegalStateError', function() {
                expect(() => stateBuilder.build())
                    .to.throw(IllegalStateError, 'Cannot build a state without a transition');
            });
        });
    });

    describe('#id', function () {
        it('returns its instance', function() {
            expect(stateBuilder.id('some-id')).to.equal(stateBuilder);
        });
    });

    describe('#initial', function () {
        it('returns its instance', function() {
            expect(stateBuilder.initial()).to.equal(stateBuilder);
        });
    });

    describe('#transition', function () {
        it('returns its instance', function() {
            expect(stateBuilder.transition(transitionFactory)).to.equal(stateBuilder);
        });

        it('invokes the supplied transition factory', function() {
            expect(transitionFactory.called).to.be.true;
        });
    });
});
