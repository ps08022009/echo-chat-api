package com.pranav.message_api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/message")  
public class MessageController {

    @Autowired
    private MessageService messageService;  

    @GetMapping("/all")  
    public List<Message> getAllMessages() {
        return messageService.getAllMessages();
    }
    @PostMapping("/add")
    public Message addMessage(@RequestBody Message message) {
        return messageService.addMessage(message);
    }
    @DeleteMapping("/delete") 
    public void deleteAllMessages() {
        messageService.deleteAllMessages();
    }
}
