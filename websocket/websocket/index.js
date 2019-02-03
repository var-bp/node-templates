// socket.io vs websockets https://stackoverflow.com/a/38558531
// https://codeburst.io/why-you-don-t-need-socket-io-6848f1c871cd

// https://habr.com/ru/post/209144/
// https://habr.com/ru/post/209524/
// https://habr.com/ru/post/213559/
// https://habr.com/ru/post/276067/

// WebSocket is a communications protocol that provides a full-duplex communication channels over
// a single TCP connection established between a web browser (client) and a web server (this take
// place through the “classic HTTP mechanism” of handshaking, implemented using request/response
// headers).

// TCP - транспортный протокол передачи данных в сетях TCP/IP, предварительно устанавливающий
// соединение с сетью.
// UDP – транспортный протокол, передающий сообщения-датаграммы без необходимости установки
// соединения в IP-сети.

// Основные отличия TCP от UDP:
// 1. TCP гарантирует доставку пакетов данных в неизменных виде, последовательности и без потерь,
// UDP ничего не гарантирует.
// 2. TCP нумерует пакеты при передаче, а UDP нет.
// 3. TCP работает в дуплексном режиме, в одном пакете можно отправлять информацию и подтверждать
// получение предыдущего пакета.
// 4. TCP требует заранее установленного соединения, UDP соединения не требует, у него это просто
// поток данных.
// 5. UDP обеспечивает более высокую скорость передачи данных.
// 6. TCP надежнее и осуществляет контроль над процессом обмена данными.
// 7. UDP предпочтительнее для программ, воспроизводящих потоковое видео, видеофонии и телефонии,
// сетевых игр.
// 8. UPD не содержит функций восстановления данных.

const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const port = process.env.PORT || 5000;
const host = process.env.HOST || 'localhost';
const server = http.createServer(app);
const wss = new WebSocket.Server({ port });

// wss.on('connection', (ws) => {
//   ws.on('message', (message) => {
//     console.log('received: %s', message);
//     ws.send(`Hello, you sent -> ${message}`);
//   });
//   ws.send('Hi there, I am a WebSocket server');
// });

// Message broadcasting
// wss.on('connection', (ws) => {
//   ws.on('message', (message) => {
//     console.log('received: %s', message);
//     const broadcastRegex = /^broadcast\:/;
//     if (broadcastRegex.test(message)) {
//       message = message.replace(broadcastRegex, '');
//       // send back the message to the other clients
//       wss.clients
//         .forEach((client) => {
//           if (client !== ws) client.send(`Hello, broadcast message -> ${message}`);
//         });
//     } else {
//       ws.send(`Hello, you sent -> ${message}`);
//     }
//   });
// });

//  Handle broken connections
// pings and Pongs are just regular frames, but they are specific control frames defined
// by the specs of WebSocket protocol in order to check if the remote endpoint is still
// connected. In this case we are setting the isAlive to false to understand if the client
// pong event sets it back to true, completing the connection check.
wss.on('connection', (ws) => {
  // when the 'connection' starts, doing the same when the 'pong' event is called
  ws.isAlive = true;
  ws.on('pong', () => { ws.isAlive = true; });
  ws.on('message', (message) => {}); // connection is up, let's add a simple simple event
});

setInterval(() => {
  wss.clients.forEach((ws) => {
    // if false we terminate the client connection
    if (!ws.isAlive) return ws.terminate();
    ws.isAlive = false;
    ws.ping(null, false, true);
  });
}, 10000);

server.listen({ port, host }, (error) => {
  if (error) throw error;
  console.log(`Server started on port ${server.address().port} :)`);
});
