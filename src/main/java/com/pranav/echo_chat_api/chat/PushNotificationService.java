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
