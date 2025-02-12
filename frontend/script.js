// Elementos do login
const login = document.querySelector(".login");
const loginForm = login.querySelector(".login__form");
const loginInput = login.querySelector(".login__input");

// Elementos do chat
const chat = document.querySelector(".chat");
const chatForm = chat.querySelector(".chat__form");
const chatInput = chat.querySelector(".chat__input");
const chatMessages = chat.querySelector(".chat__messages");

const colors = [
  "cadetblue",
  "darkgoldenrod",
  "cornflowerblue",
  "darkkhaki",
  "hotpink",
  "gold",
];

const user = { id: "", name: "", color: "" };

let websocket;

// Debug inicial
console.log("Script chat.js carregado");

// Funções de criação de elementos
createMessageSelfElement = (content) => {
  const div = document.createElement("div");
  div.classList.add("message--self");
  div.textContent = content;
  return div;
};

const createMessageOtherElement = (content, sender, senderColor) => {
  const div = document.createElement("div");
  const span = document.createElement("span");

  div.classList.add("message--other");
  span.classList.add("message--sender");
  span.style.color = senderColor;
  span.textContent = sender;

  div.appendChild(span);
  div.appendChild(document.createTextNode(content));

  return div;
};

// Gerador de ID alternativo
const generateUserId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

const getRandomColor = () => {
  return colors[Math.floor(Math.random() * colors.length)];
};

const scrollScreen = () => {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth",
  });
};

// Processamento de mensagens
const processMessage = ({ data }) => {
  try {
    const { userId, userName, userColor, content } = JSON.parse(data);

    const message =
      userId === user.id
        ? createMessageSelfElement(content)
        : createMessageOtherElement(content, userName, userColor);
    chatMessages.appendChild(message);
    scrollScreen();
  } catch (error) {
    console.error("Erro ao processar mensagem:", error);
  }
};

// Handlers WebSocket
const setupWebSocket = () => {
  websocket = new WebSocket("wss://chat-online-b6dy.onrender.com");

  websocket.onopen = () => {
    console.log("Conectado ao servidor WebSocket");
    chat.style.display = "flex";
  };

  websocket.onerror = (error) => {
    console.error("Erro na conexão WebSocket:", error);
    alert("Erro ao conectar ao servidor!");
  };

  websocket.onclose = () => {
    console.log("Conexão WebSocket fechada");
    chat.style.display = "none";
    login.style.display = "block";
  };

  websocket.onmessage = processMessage;
};

// Login Handler
const handleLogin = (event) => {
  event.preventDefault();

  if (!loginInput.value.trim()) {
    alert("Por favor insira um nome válido!");
    return;
  }

  user.id = generateUserId();
  user.name = loginInput.value.trim();
  user.color = getRandomColor();

  console.log("Tentando login com:", user.name);

  login.style.display = "none";
  setupWebSocket();
};

// Envio de mensagens
const sendMessage = (event) => {
  event.preventDefault();

  if (!chatInput.value.trim() || !websocket) return;

  const message = {
    userId: user.id,
    userName: user.name,
    userColor: user.color,
    content: chatInput.value.trim(),
  };

  console.log("Enviando mensagem:", message);

  try {
    websocket.send(JSON.stringify(message));
    chatInput.value = "";
    chatInput.focus();
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
  }
};

// Event Listeners
loginForm.addEventListener("submit", handleLogin);
chatForm.addEventListener("submit", sendMessage);
