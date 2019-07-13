import React from 'react';
import { ToogleProvider } from '../../context/toggleContext';
import UpdateTodoForm from '../UpdateTodoForm/UpdateTodoForm';
import Todo from '../Todo/Todo';

const ToogleStore = () => (
    <ToogleProvider>
        <Todo /> {/* or TodoList */}
        <UpdateTodoForm />
    </ToogleProvider>
)
export default ToogleStore;