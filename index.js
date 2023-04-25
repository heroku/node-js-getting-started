const express = require('express');
const WebSocket = require('ws');
require('dotenv/config');

const app = express();
const server = app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));

// Lista para armazenar todas as conexões WebSocket ativas
const clients = [];

// Endpoint HTTP POST na rota /maquinas
app.post('/maquinas', (req, res) => {
  // Aqui você pode adicionar o código para manipular os dados recebidos pelo endpoint

  // Envia a mensagem para todos os clientes conectados no WebSocket
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(req.body);
    }
  });

  res.send('Dados recebidos com sucesso!');
});

// Canal de comunicação WebSocket
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Cliente conectado');

  // Adiciona o objeto WebSocket correspondente ao array de clientes
  clients.push(ws);

  ws.on('message', (data) => {
    console.log(`Dados recebidos pelo WebSocket: ${data}`);
    // Envia a mensagem para todos os clientes conectados no WebSocket
    clients.forEach((client) => {

      const obj = JSON.parse(JSON.stringify(data));
      if (client.readyState === WebSocket.OPEN) {
        client.send(Buffer.from(obj.data).toString());
      }
    });
  });
});
