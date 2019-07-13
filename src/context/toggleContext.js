import React, { useReducer } from 'react';
import toogleReducer from '../reducer/toogleReducer';

const initialState = false;

const ToogleContext = React.createContext(initialState);

const ToogleProvider = (props) => {
    const [toogle, dispatchToogle] = useReducer(toogleReducer, initialState);

    return (
        <ToogleContext.Provider value={[toogle, dispatchToogle]} >
            {props.children}
        </ToogleContext.Provider>
    )
}

export { ToogleContext, ToogleProvider }