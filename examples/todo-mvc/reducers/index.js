/**
 * Created by jwqin on 11/15/15.
 */
import {combineReducers} from 'redux'
import _ from 'lodash'

export default combineReducers({
  todos: function (state = [], action){
    const {type, payload, error} = action;
    switch (type){
      case 'ADD_TODO_COMPLETED':
        return [
          payload,
          ...state
        ];
      case 'EDIT_TODO_START':
      case 'EDIT_TODO_COMPLETED':
        return _.map(state, (item)=> item.id === payload.id ? payload: item);
      case 'EDIT_TODO_FAILED':
        return _.map(state, (item)=> item.id === payload.old.id ? payload.old : item);
      case 'DELETE_TODO':
        return _.filter(state, (item)=>item.id !== payload.id);
    }
    return state;
  },
  isLoading: function (state = false, action) {
    const {type} = action;

    switch (type){
      case 'ASYNC_STARTED':
        return true;
      case 'ASYNC_ENDED':
        return false;
    }
    return state;
  }
})