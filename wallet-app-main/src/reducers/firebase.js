const firebase = (state = null, action) => {
    switch(action.type) {
        case 'SET_FIREBASE':
            return action.payload;
            break;
        default: 
            return state;
            break;
    }
}

export default firebase;