import { diskStorage } from  'multer';
import Hash from './hash';
import * as moment from 'moment';

const UploadFile = (folderName: string) => {
	return {
		storage: diskStorage({
          destination: `./public/storage/${ folderName }/`, 
          filename: (req, file, cb) => {
          	  let format = '';
          	  switch(file.mimetype) {
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
	          return cb(null, `${ Hash.makeSync(file.originalname + moment().format('YYYYMMDDHHmmss'))
	          	.replace(/\//g,'')
				.replace(/\./g,'')
				.replace(/,/g,'') }.${ format }`);
	      }
        })
	}
}

const getFileExtByMimeType = (mimetype: string): string => {
  switch (mimetype) {
    case 'image/jpeg':
      return 'jpg';
    case 'image/png':
      return 'png';
    case 'image/png':
      return 'png';
    case 'video/mp4':
      return 'mp4';
    case 'video/x-msvideo':
      return 'avi';
    case 'video/x-ms-wmv':
      return 'wmv';
    case 'video/quicktime':
      return 'mov';
    case 'video/3gpp':
      return '3gp';
    case 'video/x-flv':
      return 'flv';
    case 'image/gif':
      return 'gif';
    case 'application/pdf':
      return 'pdf';
    default:
      return 'jpg';
  }
}

const makeFileName = (file: Express.Multer.File) => {
  const name = Hash.makeSync(moment().unix().toString() + moment().millisecond().toString());
  const extension = getFileExtByMimeType(file.mimetype);
  return name
    .replace(/\//g, '')
    .replace(/\./g, '')
    .replace(/,/g, '')
    + '.'
    + extension;
}

export {
	UploadFile,
	makeFileName,
}