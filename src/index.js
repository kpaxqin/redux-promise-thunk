const steps = {
  START: 'START',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED'
};

function createPromiseThunk(type, promiseCreator, metaCreator) {

  const getType = getTypeByStep(type);
  const getMeta = isFunction(metaCreator) ? metaCreator : getMetaByStep(metaCreator);

  function createActionForStep(step, payload) {
    return createAction(getType(step), payload, getMeta(step));
  }

  return data => dispatch => {
    dispatch(createActionForStep(steps.START, data));

    const promise = promiseCreator.call(this, data);

    if (promise && promise.then) {
      promise.then((result)=>{
        dispatch(createActionForStep(steps.COMPLETED, result));
      }, (err)=>{
        dispatch(createActionForStep(steps.FAILED, err));
      });
    } else {
      throw new TypeError('The return of promiseCreator must be a promise object');
    }
  };
}

const isFunction = target => typeof target === 'function';

const getTypeByStep = type => step => `${type}_${step}`;

const getMetaByStep = meta => step => ({asyncStep: step, ...meta});

function createAction(type, payload, meta) {
  const action = {
    type,
    payload,
    meta
  };

  if (payload instanceof Error) {
    action.error = true;
  }

  return action;
}


export default {
  createPromiseThunk,
  steps
};
