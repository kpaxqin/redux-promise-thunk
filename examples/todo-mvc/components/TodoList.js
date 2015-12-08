/**
 * Created by jwqin on 11/15/15.
 */
import React , {Component, PropTypes} from 'react'
import TodoItem from './TodoItem.js'

class TodoList extends Component{
  static propTypes = {
    todos: PropTypes.array
  }

  static test123= {}

  render(){
    const {todos, actions} = this.props;

    return (
      <ul className="todo-list">
        {
          todos.map((todo, index)=>(
            <TodoItem
              key={index}
              todo={todo}
              {...actions}
              />
          ))
        }
      </ul>
    )
  }
}
export default TodoList