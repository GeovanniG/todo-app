import React from 'react';
import Nav from '../Nav/Nav';
import TodoList from '../TodoList/TodoList';
import TodoForm from '../TodoForm/TodoForm';
import { TodoProvider } from '../../context/todoContext';

const HomePage = () => {
    return (
        <div className="container">
            <h1>Todos</h1>
            <TodoProvider>
                <Nav />
                <TodoList />
                <TodoForm />
            </TodoProvider>
        </div>
    )
}

export default HomePage;