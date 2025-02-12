const { WebSocketServer } = require("ws");
const dotenv = require("dotenv");

dotenv.config();

// Define a porta usando a variável de ambiente do Render ou 8080 como fallback
const port = process.env.PORT || 8080;

// Inicia o servidor WebSocket
const wss = new WebSocketServer({ port });

wss.on("connection", (ws) => {
  ws.on("error", console.error);

  ws.on("message", (data) => {
    wss.clients.forEach((client) => client.send(data.toString()));
  });

  console.log("client connected");
});

// Loga a porta em que o servidor está rodando
console.log(`WebSocketServer is running on port ${port}`);
