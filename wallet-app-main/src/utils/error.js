import Alert from './alert';

class Error {
	
	default = (err) => {
		if (err.response && err.response.status === 422) {
			Alert.showAlert(err.response.data.error);
         	return;
		}
		else {
			console.log(err);
		}
	}
}

export default new Error();