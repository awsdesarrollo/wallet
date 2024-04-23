import io from "socket.io-client";
import Config from 'react-native-config';

const Socket = io(Config.APP_SOCKET);

const attemptToReconnect = () => {
  Socket.connect();
  setTimeout(() => {
    if (Socket.connected) {
      return;
    }

    attemptToReconnect();
  }, 500);
};

Socket.on('disconnect', () => {
  attemptToReconnect();
});

export default Socket;