const jwt = (state = null, action) => {
	switch(action.type) {
		case 'SET_JWT':
			return action.payload;
		default:
			return state;
	}
}

export default jwt;