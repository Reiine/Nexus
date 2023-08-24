const socket = io();
var username;
var chats = document.querySelector('.chatscreen');
var userList = document.querySelector('.people');
var numberofusers = document.querySelector('.numberofusers');
var userSend = document.querySelector('#userSend');
var userMsg = document.querySelector('#userMsg')
var scrolldiv = document.querySelector('.chatscreen')
scrolldiv.scrollTop = scrolldiv.scrollHeight;

var username;
do{
    username = prompt("Please enter your name: ")
}while(!username)

socket.emit("newUserJoined", username)

socket.on("newConnection", (socketName) => {
    userJoinLeft(socketName, "joined");
})

socket.on("userDisconnected", (user) => {
    userJoinLeft(user, "left");
})

function userJoinLeft(name, status) {
    let div = document.createElement('div');
    div.classList.add("userjoin");
    let content = `<p><b>${name}</b> ${status} the chat</p>`
    div.innerHTML = content;
    chats.appendChild(div)
    scrolldiv.scrollTop = scrolldiv.scrollHeight;

}

socket.on('userList', (users) => {
    userList.innerHTML = "";
    userArr = Object.values(users);
    for (i = 0; i < userArr.length; i++) {
        let p = document.createElement('p');
        p.innerText = userArr[i];
        userList.appendChild(p);
    }
    numberofusers.innerHTML = userArr.length;
})


userSend.addEventListener('click', () => {
    let data = {
        user: username,
        msg: userMsg.value
    };
    if (userMsg.value != '') {
        appendMessage(data, 'outgoing');
        socket.emit('message', data);
        userMsg.value = '';
    }
})

window.addEventListener('keypress', (e) => {
    if (e.key === "Enter") {
        e.preventDefault()
        let data = {
            user: username,
            msg: userMsg.value
        };
        if (userMsg.value != '') {
            appendMessage(data, 'outgoing');
            socket.emit('message', data);
            userMsg.value = '';
        }
    }
})

function appendMessage(data, status) {
    let div = document.createElement('div')
    div.classList.add('message', status);
    let content = `<h5>${data.user}</h5> <p>${data.msg}</p>`;
    div.innerHTML = content;
    chats.appendChild(div);
    scrolldiv.scrollTop = scrolldiv.scrollHeight;

}

socket.on('message', (data) => {
    appendMessage(data, 'incoming')
})

