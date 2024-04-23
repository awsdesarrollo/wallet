const user = (state = null, action) => {
	switch(action.type) {
		case 'SET_USER':
            return action.payload;
            break;
        default: 
        	return state;
        	break;
	}
}

export default user;