const removeTodo = (title) => ({
    type: 'REMOVE_TODO',
    title
});

const addTodo = (todo) => ({
    type: 'ADD_TODO',
    todo
});

const updateTodo = (oldTodo, newTodo) => ({
    type: 'UPDATE_TODO',
    oldTodo,
    newTodo
});

const addManyTodos = (todos) => ({
    type: 'ADD_MANY_TODOS',
    todos
})

const removeAllTodos = () => ({
    type: 'REMOVE_ALL_TODOS'
})

export { removeTodo, addTodo, updateTodo, addManyTodos, removeAllTodos };