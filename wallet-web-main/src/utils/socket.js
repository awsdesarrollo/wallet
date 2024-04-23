import io from 'socket.io-client';

export const Socket = io(process.env.REACT_APP_SOCKET, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: Infinity,
  forceNew: false
});
