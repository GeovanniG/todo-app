import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import FormPage from '../components/FormPage/FormPage';
import HomePage from '../components/HomePage/HomePage';

const Router = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" component={HomePage} exact />
                <Route path="/form" component={FormPage} />
                <Route path="/:id/todo" component={HomePage} />
            </Switch>
        </BrowserRouter>
    )
}

export default Router;