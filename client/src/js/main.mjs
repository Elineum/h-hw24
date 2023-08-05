let webSocket;

const openSocket = () => {
  webSocket = new WebSocket("ws://localhost:7778");

  webSocket.onopen = () => {
    renderStatus();
    setButtonStatus();
    toggleNameVisibility();
    renderChat();
    toggleNameRules();
  };
  webSocket.onmessage = (reply) => {
    const chatField = document.querySelector(".chat");
    const newMessageEl = document.createElement("div");
    newMessageEl.innerHTML = reply.data;
    chatField.append(newMessageEl);
  };
  webSocket.onclose = () => {
    renderStatus();
    setButtonStatus();
    toggleNameVisibility();
    toggleNameRules();
    document.querySelector(".chat-box").innerHTML = "";
  };
};

const toggleNameRules = () => {
  const rulesElement = document.querySelector(".name-rules");
  rulesElement.classList.toggle("open");
};

const toggleNameVisibility = () => {
  const inputName = document.getElementById("username");
  const spanNameEl = document.querySelector(".username-span");

  inputName.classList.toggle("hide");
  spanNameEl.classList.toggle("hide");
};

const closeSocket = () => {
  webSocket.close();
};

const renderStatus = () => {
  const statusElement = document.querySelector(".status");
  const socketActive = webSocket?.readyState === 1;
  statusElement.innerHTML = `
    <h2>Connect Status:<br>
    ${socketActive ? "Connected" : "Not connected"}</h2>`;
};

const setButtonStatus = () => {
  const socketActive = webSocket?.readyState === 1;
  document.querySelector(".connect-btn").disabled = socketActive ? true : false;
  document.querySelector(".disconnect-btn").disabled = socketActive
    ? false
    : true;
};

const setName = () => {
  const inputName = document.getElementById("username");
  const spanNameEl = document.querySelector(".username-span");
  spanNameEl.innerHTML = `<b>${inputName.value}</b>`;
};

const renderUserInfo = () => {
  const userInfoElement = document.querySelector(".user-info");
  userInfoElement.innerHTML = `
    <div class="name">
      <label for="username">Name:
        <span class="username-span hide"></span>
      </label>
      <input type="text" name="username" id="username" />
      <div class="name-rules open">
       <div style="min-height: 0">
        <h3>Name rules:</h3>
        <ul class="rules-list">
          <li>Can't contain only special symbols</li>
          <li>Can't contain only numbers</li>
          <li>Can't contain only empyspaces</li>
        </ul>
        <p>Good name example: Aria, John, Kitty...</p>
       </div>
      </div>
    </div>
    <div class="buttons-container">
      <button class="connect-btn" disabled>Connect</button>
      <button class="disconnect-btn" disabled>Disconnect</button>
    </div>`;

  const connectBtn = document.querySelector(".connect-btn");
  const disconnectBtn = document.querySelector(".disconnect-btn");
  const nameInput = document.getElementById("username");

  nameInput.addEventListener("input", setConnectPossible);
  connectBtn.addEventListener("click", openSocket);
  connectBtn.addEventListener("click", setName);
  disconnectBtn.addEventListener("click", closeSocket);
};

const setConnectPossible = () => {
  const nameConnectionBtn = document.querySelector(".connect-btn");

  if (isNameCorrect()) {
    nameConnectionBtn.disabled = false;
    return;
  }

  nameConnectionBtn.disabled = true;
};

const setMessagePossible = () => {
  const messageButton = document.querySelector(".message-button");
  const messageInput = document.getElementById("message-input");

  if (/^\S/.test(messageInput.value.trim())) {
    messageButton.disabled = false;
    return;
  }

  messageButton.disabled = true;
};

const isNameCorrect = () => {
  const nameInput = document.getElementById("username");
  const regex =
    /^(?!\s*$)(?!.*[@!#$%^&*()_+|\\\/<>\[\]{};:'",.?=\-~`0-9])[^\s]+$/;
  const inputValue = nameInput.value?.trim();
  return regex.test(inputValue);
};

const sendMessage = () => {
  const messageInput = document.getElementById("message-input");
  const messageButton = document.querySelector(".message-button");
  const userName = document.querySelector(".username-span").textContent;

  webSocket.send(JSON.stringify({ userName, message: messageInput.value }));
  messageInput.value = "";
  messageButton.disabled = true;
  messageInput.focus();
};

const renderChat = () => {
  const chatElement = document.querySelector(".chat-box");

  chatElement.innerHTML = `
  <div class="chat"></div>
  <div class="message-field border">
    <label for="message-input">Enter your message:</label>
    <input type="text" id="message-input"/>
    <button class="message-button" disabled>Send</button>
  </div>`;

  const messageInput = document.getElementById("message-input");
  const messageButton = document.querySelector(".message-button");
  messageInput.addEventListener("input", setMessagePossible);

  messageButton.addEventListener("click", sendMessage);
  messageInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  });
};

renderStatus();
renderUserInfo();
