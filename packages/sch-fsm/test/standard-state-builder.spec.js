/**
 * @flow
 */

import { expect } from 'chai';
import sinon from 'sinon';

import { MissingExecutorError, MissingIdError } from '../src/errors';
import type { Executor, ExecutorFactory, State, StateBuilder, StateId, StateIdRegistry } from '../src/types';
import { StandardState, StandardStateBuilder } from '../src/state';
import { TestContext } from './util';

describe('StandardStateBuilder', function () {
    let contextClass: Class<TestContext> = TestContext,
        executor: Executor<TestContext> = sinon.stub(),
        executorFactory: ExecutorFactory<TestContext>
            = sinon.stub().returns(executor),
        stateBuilder: StateBuilder<TestContext>,
        stateId: StateId = 'some-state-id';

    beforeEach(function () {
        stateBuilder = new StandardStateBuilder(TestContext);
    });

    describe('#build', function () {
        context('when all required components have been supplied', function() {
            let state: State<TestContext>;

            beforeEach(function() {
                state = stateBuilder.id(stateId)
                    .executor(executorFactory)
                    .build();
            });

            it('returns a state', function() {
                expect(state).to.not.be.null;
            });

            describe('the state', function() {
                describe('#executor', function() {
                    it('is equal to the executor created by the supplied executor factory', function() {
                        expect(state.executor()).to.equal(executor);
                    });
                });

                describe('#id', function() {
                    it('is equal to the state id value provided to the state builder', function() {
                        expect(state.id()).to.equal(stateId);
                    });
                });

                describe('#transitionsTo', function() {
                    const stateNames: Array<string> = ['some-state-1', 'some-state-2'],
                        stateIds: Array<StateId> = [];

                    before(function() {
                        executorFactory.callsFake(function(stateIdRegistry: StateIdRegistry) {
                            stateNames.forEach(name => {
                                stateIds.push(stateIdRegistry.get(name));
                            });

                            return executor;
                        });
                    });

                    it('returns all and only the states registered by the executor factory', function() {
                        expect(state.transitionsTo()).to.have.lengthOf(stateIds.length);
                        state.transitionsTo().forEach((stateId, i) => {
                            expect(stateId).to.equal(stateIds[i]);
                        });
                    });
                });
            });
        });

        context('when no executor has been supplied', function() {
            beforeEach(function() {
                stateBuilder.id(stateId);
            });

            it('throws an MissingExecutorError', function() {
                expect(() => stateBuilder.build()).to.throw(MissingExecutorError);
            });
        });

        context('when no id has been supplied', function() {
            beforeEach(function() {
                stateBuilder.executor(executorFactory);
            });

            it('throws an MissingIdError', function() {
                expect(() => stateBuilder.build()).to.throw(MissingIdError);
            });
        });
    });

    describe('#executor', function () {
        it('returns its instance', function() {
            expect(stateBuilder.executor(executorFactory)).to.equal(stateBuilder);
        });

        it('invokes the supplied executor factory', function() {
            expect(executorFactory.called).to.be.true;
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
});
