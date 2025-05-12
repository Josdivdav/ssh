const { Server } = require('ssh2');
const net = require('net');
const fs = require('fs');
const hostKey = fs.readFileSync('./host_key');
const server = new Server({
  hostKeys: [{ key: hostKey, type: 'rsa' }], 
  // SSH server options
}, (client) => {
  client.on('authentication', (ctx) => {
    // Authenticate users
  });

  client.on('ready', () => {
    // Establish port forward
    const publicPort = 8080; // Example public port
    const localHost = 'localhost'; // Example local host
    const localPort = 8081; // Example local port

    const server = net.createServer((socket) => {
      const localSocket = net.connect(localPort, localHost, () => {
        socket.pipe(localSocket);
        localSocket.pipe(socket);
      });
    });

    server.listen(publicPort, () => {
      console.log(`Public port ${publicPort} forwarded to ${localHost}:${localPort}`);
    });
  });
});

server.listen(2222, () => {
  console.log('SSH server listening on port 2222');
});
