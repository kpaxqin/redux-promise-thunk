import {steps, createPromiseThunk} from '../src/index';
import chai, {assert} from 'chai';
import sinon from 'sinon';

describe('redux promise thunk: ', function() {
  describe('method createPromiseThunk', function() {
    const actionName = 'TEST_ACTION';
    let actionHandler;
    let dispatch ;

    function invokeThunk(thunk) {
      thunk(dispatch);
    }

    function createAsyncPromise(result) {
      return new Promise(function(resolver, reject) {
        setTimeout(function() {
          const fn = (result instanceof Error) ? reject: resolver;

          fn(result);
        });
      });
    }

    beforeEach(function() {
      actionHandler = createPromiseThunk(actionName, function(data) {
        return Promise.resolve(data);
      });
      dispatch = sinon.spy();
    });

    it('should return handler function which accept one argument', function() {
      assert.strictEqual(typeof actionHandler, 'function');
      assert.strictEqual(actionHandler.length, 1);
    });

    it('should return thunk function when handler function been called', function() {
      assert.strictEqual(typeof actionHandler(1), 'function');
    });

    context('when thunk function been excuted', function() {
      it('should invoke promiseCreator with argument passed to handler', function() {
        const promiseCreator = sinon.spy(function(data) {
          return Promise.resolve(data);
        });

        actionHandler = createPromiseThunk(actionName, promiseCreator);

        invokeThunk(actionHandler(1));

        assert(promiseCreator.calledWith(1));
      });

      it('should throw TypeErrot when return of promiseCreator is not a promise', function() {
        const promiseCreator = sinon.spy(function(data) {
          return {};
        });

        actionHandler = createPromiseThunk(actionName, promiseCreator);

        try{
          invokeThunk(actionHandler(1));
        } catch(e) {
          assert(e instanceof TypeError);
        }
      });

      it('should dispatch start action', function() {
        const data = 1;

        invokeThunk(actionHandler(data));

        const action = dispatch.args[0][0];

        assert.strictEqual(action.type, `${actionName}_${steps.START}`);
        assert.strictEqual(action.payload, data);
        assert.strictEqual(action.meta.asyncStep, steps.START);
      });

      it('should call metaCreator with step.START', function() {
        const metaCreator = sinon.spy();
        actionHandler = createPromiseThunk(actionName, data=> Promise.resolve(data), metaCreator);

        invokeThunk(actionHandler(1));

        assert(metaCreator.calledWith(steps.START));
      });
    });

    context('when promise resolved', function() {
      it('should dispatch completed action', function(done) {
        actionHandler = createPromiseThunk(actionName, function(data) {
          const result = data + 1;

          return createAsyncPromise(result);
        });

        dispatch = sinon.spy(function(action) {
          //after start action dispatched
          if (dispatch.callCount === 2) {
            assert.strictEqual(action.type, `${actionName}_${steps.COMPLETED}`);
            assert.strictEqual(action.payload, 2);
            assert.strictEqual(action.meta.asyncStep, steps.COMPLETED);

            done();
          }
        });

        invokeThunk(actionHandler(1));
      });

      it('should call metaCreator with step.COMPLETED', function(done) {
        const metaCreator = sinon.spy(function(step) {
          if (metaCreator.callCount === 2) {
            assert(step === steps.COMPLETED);
            done();
          }
        });

        actionHandler = createPromiseThunk(actionName, function(data) {
          return createAsyncPromise(data);
        }, metaCreator);

        invokeThunk(actionHandler(1));
      });
    });

    context('when promise reject', function() {
      it('should dispatch failed action', function(done) {
        const error = new Error();
        actionHandler = createPromiseThunk(actionName, function() {
          return createAsyncPromise(error);
        });

        dispatch = sinon.spy(function(action) {
          //after start action dispatched
          if (dispatch.callCount === 2) {
            assert.strictEqual(action.type, `${actionName}_${steps.FAILED}`);
            assert(action.payload instanceof Error);
            assert(action.error);
            assert.strictEqual(action.meta.asyncStep, steps.FAILED);

            done();
          }
        });

        invokeThunk(actionHandler(1));
      });

      it('should call metaCreator with step.FAILED', function(done) {
        const metaCreator = sinon.spy(function(step) {
          if (metaCreator.callCount === 2) {
            assert(step === steps.FAILED);
            done();
          }
        });

        actionHandler = createPromiseThunk(actionName, function(data) {
          return createAsyncPromise(new Error());
        }, metaCreator);

        invokeThunk(actionHandler(1));
      });
    })
  })
});
