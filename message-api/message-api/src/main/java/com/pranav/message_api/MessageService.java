package com.pranav.message_api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    public List<Message> getAllMessages() {
        return messageRepository.findAll();
    }

    public Message addMessage(Message message) {
        return messageRepository.save(message);
    }

    public void deleteAllMessages() {
        messageRepository.deleteAll();
    }
}

