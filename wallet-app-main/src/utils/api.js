import { CommonActions } from '@react-navigation/native';
import Error from './error';
import axios from './axios';
import Globals from './globals';
import { navigationRef } from '../navigation/root-navigation';

class Api {
	
	createResponse = (uri,params = {}, type = 'post') => {
		return new Promise((resolve,reject) => {
			if (!params?.withoutLoading) {
				Globals.showLoading();
			}
			let selectType = params?.hasFile ? 'upload' : 'post';
			if (type !== 'post') selectType = type;
			axios[selectType](uri,params)
				.then((res) => {
					if (!params?.withoutLoading) {
						Globals.quitLoading();
					}
					setTimeout(() => {
						resolve(res.data);
					},100);						
				})
				.catch((err) => {
					if (!params?.withoutLoading) {
						Globals.quitLoading();
					}
					setTimeout(() => {
						if (!params?.withoutError) {
							Globals.quitLoading();
							Error.default(err);
						}						
						if (err?.response?.status === 401) {
							const navigation = navigationRef?.current;
							navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Logout' }] }))
						}
						reject(err);
					},100);
				});
		});
	}
}

export default new Api();