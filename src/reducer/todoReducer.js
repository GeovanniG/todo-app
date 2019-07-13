const todoReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return [ ...state, action.todo ];
        case 'REMOVE_TODO':
            return state.filter(({ title }) => title !== action.title);
        case 'UPDATE_TODO':
            return state.map(todo => {
                if (todo.title === action.oldTodo.title) return action.newTodo;
                return todo;
            });
        case 'ADD_MANY_TODOS': 
            return [ ...state, ...action.todos ];
        case 'REMOVE_ALL_TODOS':
            return [];
        default:
            return state;
    }
}

export default todoReducer;