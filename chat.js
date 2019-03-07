const WebSocket = require('ws');
const readline = require('readline');
const fs = require('fs');
const chalk = require('chalk');
const filter = require('./filter');

const contents = fs.readFileSync('styles.json');

const styles = JSON.parse(contents);

let address;
let username;
let socket;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const craftMessage = (from, to, kind, data) => JSON.stringify({
  from, to, kind, data,
});

/* ***************************************  Error Handling *************************************** */
const Error = {
  DUPLICATE_USER_ERROR: 'Your username is taken, please try again with a different name. Terminating Connection.',
  INVALID_USERNAME: 'Invalid username, it must be between 3 and 10 characters.',
  READ_ERROR: 'Error reading message.',
  KIND_ERROR: 'Unknown or invalid kind.',
  NO_PONG_ERROR: 'Did not get a return Pong. Terminating Connection.',
};


function handleError(data) {
  let error;
  try {
    const errorJson = JSON.parse(data);
    error = errorJson.data;
  } catch (e) {
    error = data;
  }
  switch (error) {
    case Error.DUPLICATE_USER_ERROR:
      console.log(error.data);
      process.exit();
      break;
    case Error.INVALID_USERNAME:
      console.log(error.data);
      break;
    case Error.READ_ERROR:
      console.log(error.data);
      break;
    case Error.KIND_ERROR:
      console.log(error.data);
      break;
    case Error.NO_PONG_ERROR:
      console.log(error.data);
      break;
    default:
      console.log('unexpected error');
      process.exit();
  }
}
/* ********************************************************************************************** */

/* *************************************** Handle Messages *************************************** */

function handleMessage(data) {
  const message = JSON.parse(data);
  if (message.kind === 'error') {
    handleError(data);
  }
  let str = filter.censorMessage(data);
  styles.forEach((e) => {
    const regex = new RegExp(e.expression, 'g');
    const match = str.match(regex);
    if (match !== null) {
      match.forEach((found) => {
        str = str.replace(found, chalk.keyword(e.style)(found));
      });
    }
  });
  if (message.kind === 'direct') {
    console.log(`Whisper ${message.from}: ${str}`);
  } else if ((message.from === 'GABServer') && (/has left the server!/.test(message.data) || /has joined the server!/.test(message.data))) {
    if (/has left the server!/.test(message.data)) {
      str = message.data.replace(/has left the server!/, 'has scampered away!');
      console.log(`${message.from}: ${str}`);
    } else if (/has joined the server!/.test(message.data)) {
      str = message.data.replace(/has joined the server!/, 'has scampered in!');
      console.log(`${message.from}: ${str}`);
    }
  } else {
    console.log(`${message.from}: ${str}`);
  }
  rl.prompt(true);
}
/* *************************************************************************************************** */

/* *************************************** Handle Server Close *************************************** */
function handleClose() {
  console.log('server closed!');
  process.exit();
}
/* *************************************************************************************************** */

/* *************************************** Send Messages ********************************************* */
function sendMessage(data) {
  readline.moveCursor(process.stdout, 0, -1);
  if (/^\/whoami/.test(data)) {
    socket.send(craftMessage(username, 'all', 'whoami', data));
  } else if (/^\/userlist/.test(data)) {
    socket.send(craftMessage(username, 'all', 'userlist', data));
  } else if (/^\/direct/.test(data)) {
    const to = (data.match(/[^}{]+(?=})/)).toString();
    const message = (data.match(/(?<=\}\s)(.*)/)[0]).toString();
    socket.send(craftMessage(username, to, 'direct', filter.censorMessage(message)));
    socket.send(craftMessage(username, username, 'direct', filter.censorMessage(message)));
  } else if (/^\/cheese/.test(data)) {
    socket.send(craftMessage(username, 'all', 'chat', 'cheese pic here'));
  } else {
    socket.send(craftMessage(username, 'all', 'chat', filter.censorMessage(data)));
  }
}
// rl to grab all messages to send
rl.on('line', sendMessage);

/* *********************************************************************************************** */

/* *************************************** Client Startup *************************************** */

function setConnection() {
  rl.question('Enter the address you would like to connect to:', (answer) => {
    address = answer;
    rl.question('Please enter your username: ', (input) => {
      if ((input.length < 3 || input.length > 10) && (/^[a-zA-Z0-9_]*$/.test(input))) {
        console.log('User name must be within 3 to 10 characters please try again.');
        process.exit();
      } else {
        username = input;
        socket = new WebSocket(`ws://${address}/?username=${username}`);
        socket.on('message', handleMessage);
        socket.on('error', handleError);
        socket.on('close', handleClose);
        socket.on('send', sendMessage);
      }
    });
  });
}


const client = function () {
  setConnection();
};

client();
