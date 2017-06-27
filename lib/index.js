'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var steps = {
  START: 'START',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED'
};

function isFunction(target) {
  return typeof target === 'function';
}

function createAction(type, payload, meta) {
  var action = {
    type: type,
    payload: payload,
    meta: meta
  };

  if (payload instanceof Error) {
    action.error = true;
  }

  return action;
}

function getTypeByStep(type) {
  return function (step) {
    return type + '_' + step;
  };
}

function getMetaByStep(baseMeta) {
  return function (step) {
    return _extends({
      asyncStep: step
    }, baseMeta);
  };
}

function createPromiseThunk(type, promiseCreator, metaCreator) {
  var _this = this;

  var getType = getTypeByStep(type);
  var getMeta = isFunction(metaCreator) ? metaCreator : getMetaByStep(metaCreator);

  function createActionForStep(step, payload) {
    return createAction(getType(step), payload, getMeta(step));
  }

  return function (data) {
    return function (dispatch) {
      dispatch(createActionForStep(steps.START, data));

      var promise = promiseCreator.call(_this, data);

      if (promise && promise.then) {
        return promise.then(function (result) {
          dispatch(createActionForStep(steps.COMPLETED, result));
        }, function (err) {
          dispatch(createActionForStep(steps.FAILED, err));
        });
      } else {
        throw new TypeError('The return of promiseCreator must be a promise object');
      }
    };
  };
}

exports['default'] = {
  createPromiseThunk: createPromiseThunk,
  steps: steps
};
module.exports = exports['default'];
