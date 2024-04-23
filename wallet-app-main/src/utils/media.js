import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Alert, Platform, PermissionsAndroid } from 'react-native';

const options = {
  storageOptions: {
    skipBackup: true,
    path: 'images'
  },
  noData: true
}

class Media {

	camera = () => {
		return new Promise(async (resolve,reject) => {
			if (Platform.OS == 'android') {
				const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA,
		      {
		        title: "Se necesita el permiso a la cámara",
		        message: "Se necesita el permiso a la cámara",
		        buttonNeutral: "Preguntar después",
		        buttonNegative: "Cancelar",
		        buttonPositive: "OK"
		      }
		    );
			}
			launchCamera(options,(res) => {
		    	if (res.didCancel) {
			        reject();
			    } else if (res.error) {
			        reject();
			    } else {
			    	try {
							res = res.assets[0];
				    	const uri = Platform.OS === "android" ? res.uri : res.uri.replace("file://", "");
				    	let name = res.fileName;
			        if (typeof fileName === "undefined") {
			            const getFilename = uri.split("/");
			            name = getFilename[getFilename.length - 1];
			        }
			        resolve({
			        	  uri,
			            name,
			            type: res.type
			        });
			    	}
			    	catch(e) {
			    		console.log(e);
			    	}
			    }
		    });
		});		
	}	

	gallery = () => {
		return new Promise((resolve,reject) => {
			launchImageLibrary(options,(res) => {
		    	if (res.didCancel) {
			        reject();
			    } else if (res.error) {
			        reject();
			    } else {
		        try {
							res = res.assets[0];
				      const uri = Platform.OS === "android" ? res.uri : res.uri.replace("file://", "");
				    	let name = res.fileName;
			        if (typeof fileName === "undefined") {
			            const getFilename = uri.split("/");
			            name = getFilename[getFilename.length - 1];
			        }
			        resolve({
			        	  uri,
			            name,
			            type: res.type
			        });
			    	}
			    	catch(e) {
			    		console.log(e);
			    	}
			    }
		    });
		});		
	}

	get = () => {
		return new Promise((resolve,reject) => {
			const items = [
				{
			    	text: 'Usar Cámara',
			    	onPress: async () => {
			    		this.camera().then(resolve).catch(reject);
			    	}
			    },				
			    {
			    	text: 'Usar Galería',
			    	onPress: async () => {
			    		this.gallery().then(resolve).catch(reject);
			    	}
			    },
			    {
			    	text: 'Cancelar'
			    }			    	    
			];
			Alert.alert('Opciones',"Seleccione una opción",Platform.OS == 'ios' ? items : items.reverse());
		});
	}
}

export default new Media();