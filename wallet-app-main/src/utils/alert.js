import { Alert } from 'react-native';
import prompt from 'react-native-prompt-android';

class _Alert {
	
	showAlert(message,buttons = null,options = null) {
		Alert.alert('Alerta',message,buttons,options);
	}

	showError(message = null, title = 'Alerta') {
		Alert.alert(title,message || 'Por favor, revise su conexión');
	}

	confirm = (message,callback) => {
		Alert.alert('Confirmar',message,[
		    {
		    	text: 'Cancelar'
		    },
		    {
		    	text: 'Aceptar',
		    	onPress: () => {
		    		callback();
		    	}
		    }
		]);
	}

	input = (message,callback) => {
		prompt(
	      '',
	      message,
	      [
	        {
	          text: 'Cancelar'
	        },
	        {
	          text: 'Aceptar',
	          onPress: response => {
	          	callback(response);
	          }
	        },
	      ],
	      {
	      	type: 'plain-text'
	      }
	    )
	}
}

export default new _Alert();