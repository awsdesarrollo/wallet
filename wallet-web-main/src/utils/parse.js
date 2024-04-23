import moment from 'moment';

export const objectToQueryParams = (obj) => {
  const queryParams = [];

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const encodedKey = encodeURIComponent(key);
      const encodedValue = encodeURIComponent((Array.isArray(obj[key]) ? JSON.stringify(obj[key]): obj[key]) || '');
      queryParams.push(`${encodedKey}=${encodedValue}`);
    }
  }

  return queryParams.join('&');
}

export const fromPhotos = (url) => {
  return process.env.REACT_APP_BASE_STORAGE + url;
}

export const clone = (data) => {
  return JSON.parse(JSON.stringify(data));
}

export const setMomentLocale = () => {
  moment.updateLocale('es', {
    months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
    monthsShort: 'Enero._Feb._Mar_Abr._May_Jun_Jul._Ago_Sept._Oct._Nov._Dec.'.split('_'),
    weekdays: 'Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado'.split('_'),
    weekdaysShort: 'Dom._Lun._Mar._Mier._Jue._Vier._Sab.'.split('_'),
    weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sa'.split('_')
  }
  );
}

export const createFormData = (data) => {
  var formdata = new FormData();
  for (var key in data) {
    if (Array.isArray(data[key])) {
      for (var _key in data[key]) {
        if (Array.isArray(data[key][_key])) {
          for (var i in data[key][_key]) {
            formdata.append(key + '[' + _key + '][' + i + ']', data[key][_key][i]);
          }
        }
        else {
          formdata.append(key + '[' + _key + ']', data[key][_key]);
        }
      }
    }
    else {
      formdata.append(key, data[key]);
    }
  }
  return formdata;
}

export const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ');
}

export const copy = (objectOrArray) => {
  return JSON.parse(JSON.stringify(objectOrArray));
}

export const formatAmount = (amount, symbol, conversion = 1) => {
  if (isNaN(amount)) amount = 0;
  const formatted = Intl.NumberFormat('es-VE', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(amount * conversion);
  return !!symbol ? `${symbol || ''} ${formatted}` : formatted;
}

export const autoFormatAmount = (amount, currency, conversion = 1) => {
  if (isNaN(amount)) amount = 0;
  conversion = currency?.is_local ? conversion : 1;
  const formatted = Intl.NumberFormat('es-VE', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(amount * conversion);
  return !!currency?.symbol ? `${currency?.symbol || ''} ${formatted}` : formatted;
}

export const getOnlyNumbers = (content) => {
  return content.match(/\d+/g)?.join('') || '';
}