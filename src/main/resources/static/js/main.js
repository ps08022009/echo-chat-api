'use strict';

var usernamePage = document.querySelector('#username-page');
var chatPage = document.querySelector('#chat-page');
var usernameForm = document.querySelector('#usernameForm');
var messageForm = document.querySelector('#messageForm');
var messageInput = document.querySelector('#message');
var messageArea = document.querySelector('#messageArea');
var connectingElement = document.querySelector('.connecting');
var profilePicInput = document.querySelector('#profilePic');
var profilePicPreview = document.querySelector('#profilePicPreview');

var stompClient = null;
var username = null;
var profilePicture = null;

var colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];

// File input change event listener for profile picture preview
profilePicInput.addEventListener('change', function(event) {
    var file = event.target.files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function(e) {
            profilePicPreview.src = e.target.result;
            profilePicPreview.style.display = 'block'; // Show the preview
        };
        reader.readAsDataURL(file);
    } else {
        profilePicPreview.style.display = 'none'; // Hide if no file is selected
    }
});

function connect(event) {
    username = document.querySelector('#name').value.trim();
    profilePicture = profilePicInput.files[0]; // Get the profile picture file

    if (username) {
        usernamePage.classList.add('hidden');
        chatPage.classList.remove('hidden');

        var socket = new SockJS('/ws');
        stompClient = Stomp.over(socket);

        stompClient.connect({}, onConnected, onError);
    }
    event.preventDefault();
}

function onConnected() {
    stompClient.subscribe('/topic/public', onMessageReceived);

    stompClient.send("/app/chat.addUser",
        {},
        JSON.stringify({sender: username, type: 'JOIN'})
    );

    connectingElement.classList.add('hidden');
}

function onError(error) {
    connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
    connectingElement.style.color = 'red';
}

function sendMessage(event) {
    var messageContent = messageInput.value.trim();
    if (messageContent && stompClient) {
        var chatMessage = {
            sender: username,
            content: messageInput.value,
            type: 'CHAT',
            profilePicture: profilePicture ? URL.createObjectURL(profilePicture) : null // Use null if no profile picture
        };
        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }
    event.preventDefault();
}

function onMessageReceived(payload) {
    var message = JSON.parse(payload.body);

    var messageElement = document.createElement('li');
    var displayName = (message.sender === username) ? 'Me' : message.sender;

    if (message.type === 'JOIN') {
        messageElement.classList.add('event-message');
        message.content = displayName + ' joined!';
    } else if (message.type === 'LEAVE') {
        messageElement.classList.add('event-message');
        message.content = displayName + ' left!';
    } else {
        messageElement.classList.add('chat-message');

        var avatarElement = document.createElement('img');
        avatarElement.src = message.profilePicture || getAvatarColor(message.sender); // Use getAvatarColor if no profile picture
        avatarElement.alt = message.sender;
        avatarElement.className = 'avatar'; // Add class for styling

        messageElement.appendChild(avatarElement);

        var usernameElement = document.createElement('span');
        var usernameText = document.createTextNode(displayName);
        usernameElement.appendChild(usernameText);
        messageElement.appendChild(usernameElement);

        if (message.sender !== username) {
            let audio = new Audio('/sounds/BBM-Tone-Notification.mp3');
            audio.play();
        }
    }

    var textElement = document.createElement('p');
    var messageText = document.createTextNode(message.content);
    textElement.appendChild(messageText);

    messageElement.appendChild(textElement);

    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
}

function getAvatarColor(messageSender) {
    if (!messageSender) {
        return '#CCCCCC'; // Return a neutral color if no sender
    }
    var hash = 0;
    for (var i = 0; i < messageSender.length; i++) {
        hash = 31 * hash + messageSender.charCodeAt(i);
    }
    var index = Math.abs(hash % colors.length);
    return colors[index]; // Return color based on hash
}

usernameForm.addEventListener('submit', connect, true);
messageForm.addEventListener('submit', sendMessage, true);
