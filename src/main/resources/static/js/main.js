'use strict';

var usernamePage = document.querySelector('#username-page');
var chatPage = document.querySelector('#chat-page');
var usernameForm = document.querySelector('#usernameForm');
var messageForm = document.querySelector('#messageForm');
var messageInput = document.querySelector('#message');
var messageArea = document.querySelector('#messageArea');
var connectingElement = document.querySelector('.connecting');

var stompClient = null;
var username = null;

var colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];

function connect(event) {
    username = document.querySelector('#name').value.trim();  // Get username from input field.

    if (username) {
        usernamePage.classList.add('hidden');  // Hide the username page.
        chatPage.classList.remove('hidden');   // Show the chat page.

        var socket = new SockJS('/ws');        // Create WebSocket connection.
        stompClient = Stomp.over(socket);      // Wrap the socket with STOMP protocol.

        stompClient.connect({}, onConnected, onError);  // Connect and handle callbacks.

        // Request notification permission
        if (Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    }
    event.preventDefault();  // Prevent default form submission.
}

function onConnected() {
    // Subscribe to the Public Topic
    stompClient.subscribe('/topic/public', onMessageReceived);

    // Notify server of the user's join
    stompClient.send("/app/chat.addUser",
        {},
        JSON.stringify({ sender: username, type: 'JOIN' })
    );

    connectingElement.classList.add('hidden');  // Hide connecting element on success.
}

function onError(error) {
    connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
    connectingElement.style.color = 'red';  // Show error message.
}

function sendMessage(event) {
    var messageContent = messageInput.value.trim();  // Get the message from input.

    if (messageContent && stompClient) {
        var chatMessage = {
            sender: username,
            content: messageContent,
            type: 'CHAT'
        };
        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));  // Send the message.
        messageInput.value = '';  // Clear the input field.
    }
    event.preventDefault();  // Prevent default form submission.
}

function onMessageReceived(payload) {
    var message = JSON.parse(payload.body);

    var messageElement = document.createElement('li');

    if (message.type === 'JOIN') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' joined!';
    } else if (message.type === 'LEAVE') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' left!';
    } else {
        messageElement.classList.add('chat-message');

        var avatarElement = document.createElement('i');
        var avatarText = document.createTextNode(message.sender[0]);
        avatarElement.appendChild(avatarText);
        avatarElement.style['background-color'] = getAvatarColor(message.sender);

        messageElement.appendChild(avatarElement);

        var usernameElement = document.createElement('span');
        var usernameText = document.createTextNode(message.sender);
        usernameElement.appendChild(usernameText);
        messageElement.appendChild(usernameElement);

        if (message.sender !== username) {
            const audio = new Audio("/sounds/BBM-Tone-Notification.mp3");
            audio.play();

            // Show push notification if permission is granted
            if (Notification.permission === "granted") {
                new Notification("New message from " + message.sender, {
                    body: message.content,
                    icon: "/path/to/icon.png"
                });
            }
        } else {
            return;  // No action for messages sent by the user.
        }
    }

    var textElement = document.createElement('p');
    var messageText = document.createTextNode(message.content);
    textElement.appendChild(messageText);

    messageElement.appendChild(textElement);

    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;  // Scroll to the latest message.
}

function getAvatarColor(messageSender) {
    var hash = 0;
    for (var i = 0; i < messageSender.length; i++) {
        hash = 31 * hash + messageSender.charCodeAt(i);
    }
    var index = Math.abs(hash % colors.length);
    return colors[index];
}

// Event listeners for submitting forms
usernameForm.addEventListener('submit', connect, true);
messageForm.addEventListener('submit', sendMessage, true);
