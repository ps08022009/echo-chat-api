// Function to handle Enter key press
function handleEnterKey(event) {
    if (event.key === 'Enter') {
        event.preventDefault();  // Prevent the default action (e.g., form submission)
        postText();  // Call the function to post the message
    }
}

// Function to post a new message
async function postText() {
    let val = document.getElementById("message-send-body");
    let v = val.value.trim();
    
    if (v === '') return;  // Prevent sending empty messages

    let data = { message: v };

    try {
        let response = await fetch('http://localhost:8080/message/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const audio = new Audio('sounds/BBM-Tone-Notification.mp3');
        audio.play();
        val.value = '';  // Clear the input field
        loadMessages();  // Refresh messages
    } catch (error) {
        console.error('Error posting message:', error);
    }
}

// Function to load all messages
async function loadMessages() {
    try {
        let response = await fetch('http://localhost:8080/message/all');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        let messages = await response.json();
        displayMessages(messages);  // Display all messages
    } catch (error) {
        console.error('Error loading messages:', error);
    }
}

// Function to display messages
function displayMessages(messages) {
    let messageBody = document.querySelector('.messagebody');
    messageBody.innerHTML = '';  // Clear existing messages
    messages.forEach(msg => {
        let messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.textContent = msg.message;
        messageBody.appendChild(messageDiv);
    });
}

// Function to clear all messages
async function clearMessages() {
    if (confirm("Are you sure you want to delete all messages?")) {
        try {
            let response = await fetch('http://localhost:8080/message/delete', {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            loadMessages();  // Refresh messages after clearing
        } catch (error) {
            console.error('Error clearing messages:', error);
        }
    }
}

// Load messages when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadMessages();

    // Add event listener to input field for Enter key
    document.getElementById("message-send-body").addEventListener('keydown', handleEnterKey);
});
