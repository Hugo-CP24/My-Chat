const login = document.querySelector(".Login");
const loginForm = login.querySelector(".Login_form");
const loginInput = login.querySelector(".login_input");

const chat = document.querySelector(".chat");
const chatForm = chat.querySelector(".chat_form");
const chatInput = chat.querySelector(".mensagem");
const chatMessage = chat.querySelector(".chat__mensagem");

const user = { id: "", name: "" };

let websocket;

const createMessageSelfElemnt = (content) => {
  const div = document.createElement("div");

  div.classList.add("mensagem_user");
  div.innerHTML = content;

  return div;
};

const createMessageOtherElemnt = (content, sender) => {
  const div = document.createElement("div");
  const span = document.createElement("span");

  div.classList.add("mensagem_other_user");
  span.classList.add("mensagem_other");

  span.innerHTML = sender;

  div.appendChild(span);

  div.innerHTML += content;

  return div;
};

const scrollTo = () => {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth",
  });
};

const processMessage = ({ data }) => {
  const { Userid, Username, content } = JSON.parse(data);

  const message =
    Userid == user.id
      ? createMessageSelfElemnt(content)
      : createMessageOtherElemnt(content, Username);

  chatMessage.appendChild(message);

  scrollScreen();
};

const handleLOGIN = (event) => {
  event.preventDefault();
  user.id = crypto.randomUUID();
  user.name = loginInput.value;

  login.style.display = "none";
  chat.style.display = "flex";

  websocket = new WebSocket("ws://localhost:8080");

  // Adiciona um listener para processar mensagens recebidas
  websocket.addEventListener("message", processMessage);

  console.log(user);
};

const sendMensage = (event) => {
  event.preventDefault();

  const message = {
    Userid: user.id,
    Username: user.name,
    content: chatInput.value,
  };

  websocket.send(JSON.stringify(message));

  chatInput.value = " ";
};

loginForm.addEventListener("submit", handleLOGIN);
chatForm.addEventListener("submit", sendMensage);
