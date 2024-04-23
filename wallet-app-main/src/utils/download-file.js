import RNFetchBlob from 'rn-fetch-blob';
import { Platform, Linking, PermissionsAndroid } from 'react-native';
import { Globals } from '../utils';
import { request } from 'react-native-permissions';

class DownloadFile {

    download = async (urlFile, fileName = null, description = 'Descargando...', type = 'GET') => {
        if (Platform.OS == 'ios') {
            Linking.openURL(urlFile);
            return false;
        }
        if (Platform.OS == 'android') {
            if (Platform.Version < 33) {
                const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
                if (granted !== PermissionsAndroid.RESULTS.GRANTED || granted === true)
                    return Globals.sendToast('Debe permitir el acceso al almacenamiento para poder descargar el archivo');

            } else {
                const granted = await request('android.permission.READ_MEDIA_IMAGES')
                if (granted !== PermissionsAndroid.RESULTS.GRANTED || granted === true)
                    return Globals.sendToast('Debe permitir el acceso al almacenamiento para poder descargar el archivo');
            }

            const splitExtension = urlFile.split('.')
            const extension = splitExtension[splitExtension.length - 1]
            const splitName = urlFile.split('/')
            const originalName = splitName[splitName.length - 1]
            const date = new Date;
            
            const fileNameDownload = fileName 
                ? Config.APP_NAME + `_${fileName}_${date.getTime()}.${extension}` 
                : `${date.getTime()}${originalName}`;

            const addAndroidDownloads = {
                useDownloadManager : true,
                notification: true,
                description,
                path: `${RNFetchBlob.fs.dirs.DownloadDir}/${fileNameDownload}`,
            }

            let config = {}

            if (Platform.OS === 'android') {
                config = {
                    addAndroidDownloads
                }
            }

            return RNFetchBlob.config(config).fetch(type, urlFile)
        }
    }
}

export default new DownloadFile();