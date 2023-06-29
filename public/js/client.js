
const socket = io();

var username;
var chats=document.querySelector('.chats');
var users_list = document.querySelector('.users-list');
var users_count = document.querySelector('.users-count');
var msg_send = document.querySelector('#user-send');
var user_msg = document.querySelector('#user-msg');
var currentUserWeAreChattingWith;

do{
    username = prompt("Enter your username");
}while(!username)

// It will be called when a user will join
socket.emit('new-user-joined',username);

socket.on('user-connected',(socket_name)=>{
    userJoinLeft(socket_name,'joined'); // this is the notification
})

// function to create the notification
function userJoinLeft(name,status) {
    let div = document.createElement('div');
    div.classList.add('user-join')
    let content = `<p><b>${name}</b> ${status} the chat</p>`;  // this in not single quotes this is a back tick
    div.innerHTML = content;
    chats.appendChild(div);
}

// create a notification that the user has left the chat
socket.on('user-disconnected',(user)=>{
    userJoinLeft(user,'left');
})

// function to update the list and count if a person joins or leaves the chat
socket.on('user-list',(users)=>{
    users_list.innerHTML = '';
    users_arr = Object.values(users);
 
    for(i= 0;i<users_arr.length;i++){
        let button  = document.createElement('button');
        // button.innerText = users_arr[i];
        // button.innerText = users_arr[socket.id[userName]];
        button.innerText = users_arr[i].userName;
        button.value = users_arr[i].socketID;
        // button.onclick = openChatWindow();
        button.addEventListener("click",openChatWindow);
        button.myParam = users_arr[i].socketID;


        users_list.appendChild(button);
    }

    console.log(socket.id)

    users_count.innerHTML = users_arr.length;
})

// sending message

msg_send = addEventListener('click',()=>{  
    let data = {
        user: username,
        msg: user_msg.value,
        // socketID: button.value  //socket id of the user the message is going to be sent
        socketID: currentUserWeAreChattingWith
    };

    if(user_msg.value != ''){
        appendMessage(data,'outgoing');
        socket.emit('message',data);
        user_msg.value = '';

    }
});

//recieving message
socket.on('receiveMessage',(data)=>{
    appendMessage(data,'incoming')
    console.log("Message has been received!")
})

function appendMessage(data, status){
    let div = document.createElement('div')
    div.classList.add('message',status)
    let content = `
    <h5>${data.user}</h5>
    <p>${data.msg}</p>
    `;

    div.innerHTML = content;
    chats.appendChild(div);
    chats.scrollTop = chats.scrollHeight;
    
}

// socket.on('message',(data)=>{
//     appendMessage(data,'incoming')
// })



// opening chat window of a user after clicking on them

function openChatWindow(evt){

    if(currentUserWeAreChattingWith != evt.currentTarget.myParam){

        chats.innerHTML = '';
        currentUserWeAreChattingWith = evt.currentTarget.myParam;
        //try storing the the data in a json format
        console.log("This is working")
    }
}

