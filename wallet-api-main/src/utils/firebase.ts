const firebase = require("firebase-admin")

const send = ({ tokens, message, data, title = '', androidChannelId = 'default', sound = 'default' }) => {
  if (tokens.length > 0) {
    let defaultSound: any = {
      sound: 'default'
    }

    let defaultVibrate: any = {
      vibrate: "true",
    }

    if (androidChannelId == 'none' || androidChannelId == 'no-sound') {
      defaultSound = {};
    }

    if (androidChannelId == 'none' || androidChannelId == 'no-vibration') {
      defaultVibrate = {};
    }

    firebase.messaging().sendToDevice(tokens,{
      notification: {
        title: title || "Wallet",
        body: message,
        ...defaultSound,
        ...defaultVibrate,
        badge: '1',
        android_channel_id: androidChannelId // default | no-vibration | no-sound | none
      },
      data: {
        data: JSON.stringify(data),
        android_channel_id: androidChannelId
      }
    },{
      contentAvailable: true,
      priority: 'high'
    }).then(res => {
      console.log('Success:',JSON.stringify(res))
    }).catch(err => {
      console.log('Error:',JSON.stringify(err))
    })
  }  
}

export default {
  send
}