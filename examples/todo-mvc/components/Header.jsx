import React , {Component} from 'react'
import TodoInput from './TodoInput.js'

class Header extends Component{
  render(){
    const {isLoading, onAddTodo} = this.props;

    return (
      <header className="header">
        <h1>todos</h1>
        {
          isLoading ?
            <h3 style={{textAlign: 'center'}} >
              Loading. . .
            </h3> :
            null
        }
        <TodoInput
          newTodo
          placeholder="what needs to be done?"
          onSave={onAddTodo}
          />
      </header>
    )
  }
}
export default Header