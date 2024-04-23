import { store } from '#/store';
import Toast from 'react-native-root-toast';
import Config from 'react-native-config';
import Constants from './constants';
import { Colors } from '#/utils';
import moment from 'moment';
import { Dimensions, Image } from 'react-native';

class Globals {

	BASE_STORAGE = Config.APP_BASE_STORAGE;

	fromPhotos(url) {
		return this.BASE_STORAGE + url;
	}

	showLoading() {
		store.dispatch({
			type: 'SET_LOADING'
		});
	}

	quitLoading() {
		store.dispatch({
			type: 'QUIT_LOADING'
		});
	}

	getLevelName = (level) => {
		switch (level) {
			case Constants.LEVELS.ADMIN:
				return 'Admin';

			case Constants.LEVELS.CLIENT:
				return 'Cliente';

			default:
				return 'Desconocido';
		}
	}

	formatMiles = (n, decimals = true, currency = '$', conversion = 1) => {
		n = Math.round(n * 100) / 100;
		var c = isNaN(c = Math.abs(c)) ? 2 : c,
			d = d == undefined ? "," : d,
			t = t == undefined ? "." : t,
			s = n < 0 ? "-" : "",
			i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
			j = (j = i.length) > 3 ? j % 3 : 0;

		return currency + ' ' + s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
	}

	sendToast(message, backgroundColor = Colors.black) {
	    Toast.show(message,{
	        duration: Toast.durations.SHORT,
	        position: Toast.positions.BOTTOM,
			backgroundColor
	    });
	}

	validateDouble(value) {
		return /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/.test(value);
	}

	validateInteger(value) {
		return /^\d+$/.test(value);
	}

	clone = (data) => {
		return JSON.parse(JSON.stringify(data));
	}

	clean = (_string) => {
	   var specialChars = "!@#$^&%*()+=-[]\/{}|:<>?,.";
	   for (var i = 0; i < specialChars.length; i++) {
	       _string= _string.replace(new RegExp("\\" + specialChars[i], 'gi'), '');
	   }
	   _string = _string.toLowerCase();
	   _string = _string.replace(/ /g,"_");
	   _string = _string.replace(/á/gi,"a");
	   _string = _string.replace(/é/gi,"e");
	   _string = _string.replace(/í/gi,"i");
	   _string = _string.replace(/ó/gi,"o");
	   _string = _string.replace(/ú/gi,"u");
	   _string = _string.replace(/ñ/gi,"n");
	   return _string;
  	}
	timeLog = (date) => {
		let calc = Number(moment().unix() - moment(date).unix()) - 14400;
		let time;
        if (calc <= 0) time = 'Ahora'; 
		else if((calc >= 60) && ((calc / 60) <= 48)) {
            calc /= 60;
            time = `Hace ${Math.floor(calc)} minuto(s)`;
        } 
		else if((calc > 0) && (calc <= 59)) time = 'Ahora'; 
		else if((calc / 60) >= 48) time = moment(date).format('DD/MM/YYYY h:mm a');

		return time;
	}
	calculateAge = (birthdate) => Math.floor((moment().unix() - moment(birthdate).unix()) / 31556926)

  getTotalTime = (time = 0) => {
    if (time < 60) {
      time = `${time} min`;
    } else {
      const hours = Math.floor(time / 60);
      const minutesLeft = time % 60;
      time = `${hours}h ${minutesLeft > 0 ? minutesLeft + 'min' : ''}`.trim();
    }

    return time;
  }

	getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
		const deg2rad = (deg) => deg * (Math.PI/180);
		const R = 6371; // Radius of the earth in km
		const dLat = deg2rad(lat2-lat1);
		const dLon = deg2rad(lon2-lon1);
		const a =
			Math.sin(dLat/2) * Math.sin(dLat/2) +
			Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
			Math.sin(dLon/2) * Math.sin(dLon/2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
		return R * c;
	}

	getImageHeight = (img) => {
		const asset = Image.resolveAssetSource(img);
		const widthChangeRatio = Dimensions.get('window').width / asset.width;
		return asset.height * widthChangeRatio;
	}

	getOnlyNumbers = (content) => {
		return content.match(/\d+/g)?.join('');
	}
}

export default new Globals();