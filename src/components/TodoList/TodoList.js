import React, { useContext, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import Todo from '../Todo/Todo';
import { TodoContext } from '../../context/todoContext';
import { addManyTodos } from '../../actions/todoActions';

const TodoList = (props) => {
    const [todos, dispatchTodos] = useContext(TodoContext);

    useEffect(() => {
        const callApi = async () => {
            const token = localStorage.getItem('token');

            if (props.location.pathname === '/') return;
    
            const response =  await fetch(`${props.location.pathname}`, {
                                        method: 'GET',
                                        headers: {
                                            'Authorization': `Bearer ${token}`
                                        }
                                    });

            if (response.status === 404) return;

            const todos = await response.json();
            if (!todos.name) dispatchTodos(addManyTodos(todos));
        }
        callApi();
    }, [props, dispatchTodos])

    return (
        <>
            {todos.map(({title, desc}, i) => <Todo title={title} description={desc} key={i} />)}
        </>
    )
}

export default withRouter(TodoList);