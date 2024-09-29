package com.pranav.echo_chat_api.chat;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
// import com.pranav.echo_chat_api.chat.ChatMessage;

@Service
public class PushNotificationService {

@Autowired
private FirebaseMessaging firebaseMessaging;

public String sendNotification(ChatMessage message) throws FirebaseMessagingException {
    Notification notification = Notification
            .builder()
            .setTitle("New Message from " + message.getSender())
            .setBody(message.getContent())
            .build();

    Message firebaseMessage = Message
            .builder()
            .setNotification(notification)
            .setTopic("public")
            .build();

    return firebaseMessaging.send(firebaseMessage);
}
}
