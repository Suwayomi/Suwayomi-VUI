import { ref } from 'vue';
import { LocalStorage } from 'quasar';

const eventsFromServer = ref('');
const isConnected = ref(false);
let base = LocalStorage.getItem('baseUrl') as string;
base =
  base == '/' ? document.location.origin + document.location.pathname : base;
const url = new URL(base);
url.protocol = url.protocol == 'https:' ? 'wss:' : 'ws:';
let socket: WebSocket;

const socketMessageListener = (event: MessageEvent) => {
  eventsFromServer.value = event.data;
};

const socketOpenListener = () => {
  console.log('Connected');
  isConnected.value = true;
  socket.addEventListener('message', socketMessageListener);
  socket.addEventListener('close', socketCloseListener);
};

const socketCloseListener = () => {
  isConnected.value = false;
  if (socket) {
    console.error('Disconnected.');
    socket.removeEventListener('message', socketMessageListener);
    socket.removeEventListener('open', socketOpenListener);
    socket.removeEventListener('close', socketCloseListener);
  }
  socket = new WebSocket(`${url.href.slice(0, -1)}/api/v1/downloads`);
  socket.addEventListener('open', socketOpenListener);
};
socketCloseListener();

export default function useDlSock() {
  const sendMsg = (data: string) => {
    socket.send(data);
  };
  const closeSock = () => {
    if (socket.readyState == 3) {
      socket.close();
    }
  };

  return {
    eventsFromServer,
    isConnected,
    sendMsg,
    closeSock
  };
}
