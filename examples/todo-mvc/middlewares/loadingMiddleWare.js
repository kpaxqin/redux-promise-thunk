import _ from 'lodash'
import {steps} from 'redux-promise-thunk'

function loadingMiddleWare({dispatch}) {
  return next => action => {
    const asyncStep = _.get(action, 'meta.asyncStep');
    if (asyncStep === steps.START) {
      dispatch({
        type: 'ASYNC_STARTED',
        payload: {
          action
        }
      })
    } else if (asyncStep === steps.COMPLETED || asyncStep === steps.FAILED) {
      dispatch({
        type: 'ASYNC_ENDED',
        payload: {
          action
        }
      })
    }
    next(action);
  }
}

export default loadingMiddleWare;