/**
 * Created by jwqin on 11/15/15.
 */
import React, {Component, PropTypes} from 'react'
import classnames from 'classnames'
import TodoInput from './TodoInput.js'

class TodoItem extends Component {
  static propTypes: {
    todo: PropTypes.object
  };
  constructor(props){
    super(props);

    this.state = {
      editing: false
    }
  }
  render(){
    const {todo, editTodo, deleteTodo} = this.props;
    const {editing} = this.state;

    const element = editing ?
      (
        <TodoInput
          editing
          text={todo.text}
          onSave={(text)=>{
            editTodo({id: todo.id, text});
            this.setState({ editing: false });
          }}
          />
      ):
      (
        <div className="view">
          <input type="checkbox" className="toggle"/>
          <label
            onDoubleClick={()=>{this.setState({editing: !editing})}}
            >{todo.text}</label>
          <button
            className="destroy"
            onClick={()=>{
              deleteTodo(todo.id);
            }}
            ></button>
        </div>
      );

    return (
      <li
        className={classnames({
          completed: todo.completed,
          editing: this.state.editing
        })}
        >
        {element}
      </li>
    );
  }
}

export default TodoItem