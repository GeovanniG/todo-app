import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import './Form.css';
import validator from 'validator';
import { MIN_PW_LEN } from './vars';

const Form = (props) => {
    const [fname, setFName] = useState('');
    const [lname, setLName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('Note: passwords cannot currently be reset');
    const [title, setTitle] = useState('Sign up');
    const [signUp, setSignUp] = useState(true);

    const onClick = async (e) => {
        e.preventDefault();

        if (!isFormValid()) return;            

        let response;
        if (signUp) response = await createUser();
        else        response = await validateUser();
        const { user, token, name } = await response.json();

        setPassword('');
        if (serverError(name)) return;

        // Temporary solution, will use until cookie behavior is sorted out
        localStorage.setItem('token', token);
        props.history.push(`/${user._id}/todo`, { email: user.email })
    }

    const serverError = name => {
        let err = false;
        if (name === 'MongoError') { 
            setMsg('Email already exists, login instead');
            err = true;
        } else if (name === 'LoginInError') {
            setMsg('Wrong email or password');
            err = true;
        } else if (name === 'NoSuchUserError') {
            setMsg('We cannot find your account please create one');
            err = true;
         } else {
            clearInput();
            setMsg('Success')
        }
        return err;
    }

    const createUser = async () => {
        return await fetch(`/user/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                placeTokenInCookie: true, 
                fname,
                lname,
                email, 
                password 
            })
        });
    }

    const validateUser = async () => {
        return await fetch(`/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                placeTokenInCookie: true, 
                email, 
                password 
            })
        });
    }

    const isFormValid = () => {
        let isValid = true;

        if (!validator.isEmail(email)) {
            setMsg('Please provide a valid email');
            isValid = false;
        } else if (password.length < MIN_PW_LEN) {
            setMsg('Please provide a password at least 6 characters long');
            isValid = false;
        }
        return isValid;
    }

    const clearInput = () => {
        setFName('');
        setLName('');
        setEmail('');
        setPassword('');
        setMsg('');
    }

    return (
        <div className="container-fluid d-flex-columnn justify-content-end mt-3">
            <div className="row">
                <div className="col-sm-3 col-lg-4"></div>
                <div className="col-sm-6 col-lg-4">
                    <div className="btn-group d-flex justify-content-end" role="group">
                        <button className="btn btn-secondary" onClick={() => { 
                            setSignUp(false);
                            setTitle('Login')
                            setMsg('');
                        }}>Login</button>
                        <button className="btn btn-secondary" onClick={() => {
                            setSignUp(true);
                            setTitle('Sign up')
                            setMsg('');
                        }}>Sign up</button>
                    </div>
                    <form onSubmit={(e) => e.preventDefault()} className="">
                        <h1>{title}</h1>
                        {msg && <p>{msg}</p>}
                        {signUp && (
                            <>
                                <div className="form-group">
                                <label htmlFor="fname">First name</label>
                                <input type="input" className="form-control" fname="fname" id="fname" placeholder="Enter first name" 
                                    value={fname} onChange={(e) => setFName(e.target.value)}
                                />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="lname">Last name</label>
                                    <input type="input" className="form-control" name="lname" id="lname" placeholder="Enter last name" 
                                        value={lname} onChange={(e) => setLName(e.target.value)}
                                    />
                                </div>
                            </>
                        )}
                        <div className="form-group">
                            <label htmlFor="email">Email address</label>
                            <input type="input" className="form-control" name="email" id="email" placeholder="Enter email" 
                                value={email} onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" className="form-control" name="password" id="password" placeholder="Password"
                                value={password} onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="btn-group" role="group">
                            <button type="submit" className="btn btn-primary" onClick={onClick}>Submit</button>
                            <button className="btn btn-primary" onClick={() => clearInput()}>Cancel</button>
                        </div>
                    </form>
                </div>
                <div className="col-sm-3 col-lg-4"></div>
            </div>
        </div>
    )
}

export default withRouter(Form);