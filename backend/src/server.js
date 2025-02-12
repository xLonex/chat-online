const express = require("express");
const { WebSocketServer } = require("ws");
const path = require("path");

const app = express();
const port = process.env.PORT || 8080;

// Serve os arquivos estáticos (frontend)
app.use(express.static(path.join(__dirname, "../frontend")));

// Inicia o servidor HTTP
const server = app.listen(port, () => {
  console.log(`Servidor HTTP rodando na porta ${port}`);
});

// Inicia o servidor WebSocket
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  ws.on("error", console.error);

  ws.on("message", (data) => {
    wss.clients.forEach((client) => client.send(data.toString()));
  });

  console.log("client connected");
});
