/**
 * Created by jwqin on 11/16/15.
 */
import _ from 'lodash'
import {createPromiseThunk} from 'redux-promise-thunk'

function apiMock(resp, err = new Error('Oops')) {
  return new Promise(function(resolve, reject){
    setTimeout(()=>{
      Math.random() < 0.7 ?
        resolve(resp):
        reject(err);
    }, 300)
  });
}

export default {
  addTodo: createPromiseThunk('ADD_TODO', function(text) {
    return apiMock({
      id: _.uniqueId('TODO_'),
      text
    })
  }),
  //Use thunk for optimistic update
  //since editTodoAction returned by createPromiseThunk is a thunk, the editTodo comes to be a composed thunk.
  editTodo: function (todo) {
    return function (dispatch, getState) {
      const oldTodo = _.find(getState().todos, item=>item.id === todo.id);

      const editTodoAction = createPromiseThunk('EDIT_TODO', function (todo) {
        const error = new Error('shit');
        error.old = oldTodo;

        return apiMock(todo, error);
      });

      dispatch(editTodoAction(todo));
    }
  },
  deleteTodo(id){
    return {
      type: 'DELETE_TODO',
      payload: {
        id
      }
    }
  }
}