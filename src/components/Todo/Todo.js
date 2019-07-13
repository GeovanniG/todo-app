import React, { useState, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { TodoContext } from '../../context/todoContext';
import { removeTodo } from '../../actions/todoActions';

const Todo = (props) => {
    const [showDesc, setShowDesc] = useState(false);
    const showDescVis = showDesc ? '' : 'd-none';
    const [msg, setMsg] = useState('');

    const callApi = async () => {
        const token = localStorage.getItem('token');

        return await fetch(`${props.location.pathname}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: props.title
            })
        })
    }

    const onClick = async () => {
        if (props.location.pathname !== '/') {
            const response = await callApi();
            const { name } = await response.json();
            if (name) return setMsg('Unable to delete. Authentication error. Please Sign in')
        }
        
        if (msg !== '') setMsg('');
        dispatchTodos(removeTodo(props.title));
    }

    const [, dispatchTodos] = useContext(TodoContext);

    return (
        <>
          {props.title && (
                <div className="card mt-2">
                    {msg && <p className="mt-3 ml-3">{msg}</p>}
                    <div className="card-header d-flex align-items-center justify-content-between">
                        <h2 className="mb-0 w-100">
                        <button className="btn btn-link" type="button" onClick={() => setShowDesc(!showDesc)}>
                            {props.title}
                        </button>
                        </h2>
                        {/* <button className="btn btn-secondary mr-2" type="button" onClick={() => }>
                            Update
                        </button> */}
                        <button className="btn btn-danger" type="button" onClick={onClick}>
                            Remove
                        </button>
                    </div>

                    <div className={`${showDescVis}`}>
                        <div className="card-body">
                            {props.description}
                        </div>
                    </div>
                </div>
          )}
            
        </>
    );
}

export default withRouter(Todo);