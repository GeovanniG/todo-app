import React, { useState, useContext } from 'react';
import { TodoContext } from '../../context/todoContext';
import { updateTodo } from '../../actions/todoActions';

const TodoForm = ({ startTitle = '', startDesc = '' } = {}) => {
    const [showDesc, setShowDesc] = useState(false);
    const [title, setTitle] = useState(startTitle);
    const [desc, setDesc] = useState(startDesc);
    const [msg, setMsg] = useState('');

    const showDescVis = showDesc ? '' : 'd-none';

    const [, dispatchTodos ] = useContext(TodoContext);

    const onClickTodo = () => {
        if (title === '') {
            setShowDesc(false);
            return setMsg('Please enter a todo');
        }
        setMsg('');
        setShowDesc(!showDesc);
    }

    const onClickDesc = () => {
        const oldTodo = {
            title: startTitle, 
            desc: startDesc
        };
        const todo = {
            title,
            desc
        }
        dispatchTodos(updateTodo(oldTodo, todo))
        setTitle('');
        setDesc('');
        setShowDesc(!showDesc);
    }

    return (
        <div className="card mt-2">
            {msg && <p className="pt-3 pl-3">{msg}</p>}
            <div className="card-header d-flex ">
                <h2 className="mb-0 flex-grow-1 mr-3">
                    <input type="text" className="form-control" placeholder="Todo" value={title} 
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </h2>
                <button className="btn btn-primary" type="button" onClick={onClickTodo}>
                    Add
                </button>
            </div>

            <div className={`${showDescVis}`}>
                <div className="card-body d-flex align-items-center">
                    <textarea className="form-control mr-3" row="5" placeholder="Description (optional)" value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                    >
                    </textarea>
                    <button className="btn btn-info" type="button" onClick={onClickDesc}>
                        Update
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TodoForm;