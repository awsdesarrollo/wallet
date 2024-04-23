const location = (state = false, action) => {
	switch(action.type) {
		case 'SET_LOCATION':  
            return action.payload;
            break;
        default: 
        	return state;
        	break;
	}
}

export default location;