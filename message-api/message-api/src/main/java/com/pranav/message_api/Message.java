package com.pranav.message_api;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "message")
public class Message {
    @Id
    ObjectId id;
    String message;

    public String getMessage() {
        return message;
    }
}
