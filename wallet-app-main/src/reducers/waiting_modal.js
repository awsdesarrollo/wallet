const waiting_modal = (state = false, action) => {
	switch(action.type) {
		case 'SET_WAITING_MODAL':  
            return true;
            break;
        case 'QUIT_WAITING_MODAL':
            return false;
            break;
        default: 
        	return state;
        	break;
	}
}

export default waiting_modal;