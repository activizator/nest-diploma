const socketOptions = {
  transportOptions: {
    polling: {
      extraHeaders: {
        Authorization: 'Bearer {jwt.token}',
      },
    },
  },
};

const SERVER = 'http://localhost:3000/';

const socket = io.connect(SERVER, socketOptions);

const message = document.getElementById('message');
const messages = document.getElementById('messages');

const SUPPORT_REQUEST_ID = 'SOME SUPPORT_REQUEST_ID';

const handleSubmitNewMessage = () => {
  fetch(`${SERVER}api/common/support-requests/${SUPPORT_REQUEST_ID}/messages`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer {jwt.token}',
    },
    body: JSON.stringify({ text: message.value }),
  }).then(() => console.log('ok'));
};

fetch(`${SERVER}api/common/support-requests/${SUPPORT_REQUEST_ID}/messages`, {
  headers: {
    Authorization: 'Bearer {jwt.token}',
  },
})
  .then((res) => res.json())
  .then((messages) => {
    messages.forEach(handleNewMessage);
  })
  .then(() => {
    socket.emit('wait messages', { requestId: SUPPORT_REQUEST_ID });
  });

socket.on('message', (data) => {
  handleNewMessage(data);
});

const handleNewMessage = (message) => {
  messages.appendChild(buildNewMessage(message));
};

const buildNewMessage = (message) => {
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(message.text));
  return li;
};
