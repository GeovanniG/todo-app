import React, { useState, useContext } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { TodoContext } from '../../context/todoContext';
import { removeAllTodos } from '../../actions/todoActions';

const Nav = (props) => {
    const email = props.location.state ? props.location.state.email : '';
    const [msg, setMsg] = useState('');

    const [ , dispatchTodos ] = useContext(TodoContext);

    const callApiLogout = async () => {
        const token = localStorage.getItem('token');

        return await fetch(`/user/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }

    const callApiDelete = async () => {
        const token = localStorage.getItem('token');

        return await fetch(`/user/delete`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }

    const onClick = async (apiCallback, err) => {
        const response = await apiCallback();
        const user = await response.json();

        if (user.name) return setMsg(err);
        if (msg !== '') setMsg('');

        dispatchTodos(removeAllTodos());
        localStorage.clear();
        props.history.push('/')
    }

    return (
        <nav className="navbar navbar-expand navbar-light bg-light">
            <ul className="navbar-nav flex-row justify-content-end w-100">
                    <li className="nav-item d-flex align-items-center">
                        {email ? (
                            <>  
                                {msg && <p className="text-break mr-3">{msg}</p>}
                                <p className="text-break mr-3">{email}</p>
                                <button className="btn btn-dark mr-3" onClick={() => onClick(callApiDelete, 'Unable to delete')}>Delete</button>
                                <button className="btn btn-dark" onClick={() => onClick(callApiLogout, 'Unable to logout')}>Logout</button>
                            </>
                        ) : (
                            <Link className="nav-link" to="/form">Login / Sign up</Link>
                        )}
                    </li>
            </ul>
        </nav>
    )
}

export default withRouter(Nav);