const appointment = (state = [], action) => {
	switch(action.type) {
		case 'SET_APPOINTMENT':
            return action.payload;
            break;
        default: 
        	return state;
        	break;
	}
}

export default appointment;