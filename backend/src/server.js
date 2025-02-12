const express = require("express");
const { WebSocketServer } = require("ws");
const path = require("path");

const app = express();
const port = process.env.PORT || 8080;

// Caminho para a pasta frontend
const frontendPath = path.join(__dirname, "../frontend");

// Serve os arquivos estáticos (frontend)
app.use(express.static(frontendPath));

// Rota padrão para servir o index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

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
