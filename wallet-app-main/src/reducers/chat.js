const chat = (state = [], action) => {
	switch(action.type) {
		case 'SET_CHAT':
            return action.payload;
            break;
        default: 
        	return state;
        	break;
	}
}

export default chat;