const socketOptions = {
  transportOptions: {
    polling: {
      extraHeaders: {
        Authorization: 'Bearer token',
      },
    },
  },
};

const socket = io.connect('http://localhost:3000/', socketOptions);

const message = document.getElementById('message');
const messages = document.getElementById('messages');

const SUPPORT_REQUEST_ID = "SOME REQUEST ID";
const handleSubmitNewMessage = () => {
  fetch(`http://localhost:3000/api/common/support-requests/${SUPPORT_REQUEST_ID}/messages`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text: message.value }),
  }).then(() => console.log('ok'));
};

fetch(`http://localhost:3000/api/common/support-requests/${SUPPORT_REQUEST_ID}/messages`)
  .then((res) => res.json())
  .then(messages => {
    messages.forEach(handleNewMessage);
  })
  .then(() => {
    socket.emit('wait messages', {requestId: SUPPORT_REQUEST_ID})
  })

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
