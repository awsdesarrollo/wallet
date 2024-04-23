import * as moment from 'moment';
import { Constants, Hash } from '.';

class Globals {
	formatMiles = (n: any, decimals: boolean = true, currency: string = '$') => {
		n = Math.round(n * 100) / 100;
		var c: any = isNaN(c = Math.abs(c)) ? 2 : c,
			d: any = d == undefined ? "," : d,
			t: any = t == undefined ? "." : t,
			s: any = n < 0 ? "-" : "",
			i: any = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
			j: any = (j = i.length) > 3 ? j % 3 : 0;

		return currency + ' ' + s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
	}
	filterByUrl = (url: string) => {
		const SYMBOLS = /(\$)|(\.)|(\?)|(\#)|(\%)|(\&)|(\/)|(\*)|(\{)|(\})|(\\)|(\:)|(\<)|(\>)|(\+)/g;
		return url.replace(SYMBOLS, '');
	}

	passwordGenerate = (longitud: number) => {
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
		let password = '';
		for (let i = 0; i < longitud; i++) {
			password += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		return password;
	}

	generateNameFile = (file) => {
		return `${Hash.makeSync(file.originalname + moment().format('YYYYMMDDHHmmss') + Math.floor(Math.random() * 100000000) + Math.floor(Math.random() * 100000000))
			.replace(/\//g, '')
			.replace(/\./g, '')
			.replace(/,/g, '')}.${this.getFormat(file.mimetype)}`;
	}

	getFormat = (mimetype) => {
		let format = '';
		switch (mimetype) {
			case 'image/jpeg':
				format = 'jpg';
				break;

			case 'image/png':
				format = 'png';
				break;

			case 'image/png':
				format = 'png';
				break;

			case 'video/mp4':
				format = 'mp4';
				break;

			case 'video/x-msvideo':
				format = 'avi';
				break;

			case 'video/x-ms-wmv':
				format = 'wmv';
				break;

			case 'video/quicktime':
				format = 'mov';
				break;

			case 'video/3gpp':
				format = '3gp';
				break;

			case 'video/x-flv':
				format = 'flv';
				break;

			case 'image/gif':
				format = 'gif';
				break;

			case 'application/pdf':
				format = 'pdf';
				break;

			default:
				format = 'jpg';
				break;
		}

		return format;
	}
  getTotalTime = (time = 0) => {
		let readableTime = String(time);
    if (time < 60) {
      readableTime = `${time} min`;
    } else {
      const hours = Math.floor(time / 60);
      const minutesLeft = time % 60;
      readableTime = `${hours}h ${minutesLeft > 0 ? minutesLeft + 'min' : ''}`.trim();
    }

    return readableTime;
  }
}
export default new Globals()