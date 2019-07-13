import React from 'react';
import { Link } from 'react-router-dom';
import Nav from '../Nav/Nav';
import TodoList from '../TodoList/TodoList';
import TodoForm from '../TodoForm/TodoForm';
import { TodoProvider } from '../../context/todoContext';

const HomePage = () => {
    return (
        <div className="container">
            <h1><Link to="/form">Todos</Link></h1>
            <TodoProvider>
                <Nav />
                <TodoList />
                <TodoForm />
            </TodoProvider>
        </div>
    )
}

export default HomePage;