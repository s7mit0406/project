const socket = io();

const username = localStorage.getItem("username");
const room = localStorage.getItem("room");

if(!username || !room){
    window.location.href = "index.html";
}

socket.emit("joinRoom", {username, room});

const editor = document.getElementById("editor");
const usersDiv = document.getElementById("users");
const chatBox = document.getElementById("chatBox");

editor.addEventListener("input", () => {
    socket.emit("codeChange", editor.value);
});

socket.on("codeChange", code => {
    editor.value = code;
});

socket.on("userList", users => {
    usersDiv.innerHTML = "";
    users.forEach(user => {
        const div = document.createElement("div");
        div.textContent = user;
        usersDiv.appendChild(div);
    });
});

function sendMessage(){
    const input = document.getElementById("messageInput");
    if(input.value.trim()){
        socket.emit("chatMessage", input.value);
        input.value = "";
    }
}

socket.on("chatMessage", data => {
    const div = document.createElement("div");
    div.innerHTML = `<b>${data.user}:</b> ${data.text}`;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
});

function logout(){
    localStorage.clear();
    window.location.href = "index.html";
}
