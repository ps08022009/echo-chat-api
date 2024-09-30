package com.pranav.echo_chat_api.config;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import com.pranav.echo_chat_api.chat.ChatMessage;
import com.pranav.echo_chat_api.chat.MessageType;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketEventListener {
    private final SimpMessageSendingOperations messageTemplate;

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());

        // Ensure session attributes are not null
        Map<String, Object> sessionAttributes = headerAccessor.getSessionAttributes();
        if (sessionAttributes != null) {
            String username = (String) sessionAttributes.get("username");

            if (username != null) {
                log.info("User disconnected: {}", username);
                var chatMessage = ChatMessage.builder()
                    .type(MessageType.LEAVE)
                    .sender(username)
                    .build();
                messageTemplate.convertAndSend("/topic/public", chatMessage);
            } else {
                log.warn("Username not found in session attributes");
            }
        } else {
            log.warn("Session attributes are null, unable to retrieve username");
        }
    }
}
