import React, { useReducer } from 'react';
import todoReducer from '../reducer/todoReducer';

const initialState = [];

const TodoContext = React.createContext(initialState);


const TodoProvider = (props) => {
    const [todos, dispatchTodos] = useReducer(todoReducer, initialState);

    return (
        <TodoContext.Provider value={[todos, dispatchTodos]}>
            {props.children}
        </TodoContext.Provider>
    )
}

export { TodoContext, TodoProvider }