const remember = (state = '', action) => {
	switch(action.type) {
		case 'SET_REMEMBER':
				return action.payload;
		default:
			return state;
	}
}

export default remember;