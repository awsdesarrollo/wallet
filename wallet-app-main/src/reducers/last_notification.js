const last_notification = (state = '', action) => {
	switch(action.type) {
		case 'SET_LAST_NOTIFICATION':
			return action.payload;
		default:
			return state;
	}
}

export default last_notification;