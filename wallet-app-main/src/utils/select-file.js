import DocumentPicker from 'react-native-document-picker';
import { Platform } from 'react-native';

export default {
	open: () => {
		return new Promise(async (resolve,reject) => {
			try {
				const res = await DocumentPicker.pick({
					type: [
						DocumentPicker.types.images,
						DocumentPicker.types.pdf
					],
				});

				const uri = Platform.OS === "android" ? res.uri : res.uri.replace("file://", "");
				let name = res.name;

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
				reject();
			}
		});
	},
	openPDF: () => {
		return new Promise(async (resolve,reject) => {
			try {
				const res = await DocumentPicker.pick({
					type: [
						DocumentPicker.types.pdf,
					],
				});

				const uri = Platform.OS === "android" ? res.uri : res.uri.replace("file://", "");
				let name = res.name;

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
				reject();
			}
		});
	}
}