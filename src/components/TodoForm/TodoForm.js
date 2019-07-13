import React, { useState, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { TodoContext } from '../../context/todoContext';
import { addTodo } from '../../actions/todoActions';

const UpdateTodoForm = (props) => {
    const [showDesc, setShowDesc] = useState(false);
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [msg, setMsg] = useState('');

    const showDescVis = showDesc ? '' : 'd-none';

    const [, dispatchTodos ] = useContext(TodoContext);

    const callApi = async () => {
        const token = localStorage.getItem('token');

        return await fetch(`${props.location.pathname}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                description: desc
            })
        })
    }

    const onClickTodo = () => {
        if (title === '') {
            setShowDesc(false);
            return setMsg('Please enter a todo');
        }
        setMsg('');
        setShowDesc(!showDesc);
    }

    const onClickDesc = async () => {
        const todo = { title, desc };
        let response = '';

        if (props.location.pathname !== '/') {
            response = await callApi();
            const { name, errmsg } = await response.json();
            if (name || errmsg) return setMsg('Unable to save. Authorization error. Please sign in');
        }

        if (!response) setMsg('List will not be saved');
        dispatchTodos(addTodo(todo))
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
                    <button className="btn btn-primary" type="button" onClick={onClickDesc}>
                        Create
                    </button>
                </div>
            </div>
        </div>
    )
}

export default withRouter(UpdateTodoForm);