const toogleReducer = (state, action) => {
    switch (action.type) {
        case 'TOOGLE_ON':
            return true;
        case 'TOOGLE_OFF':
            return false;
        default:
            return state;
    }
}

export default toogleReducer;