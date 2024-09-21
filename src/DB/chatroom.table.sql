CREATE TABLE chat_rooms (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    senderId VARCHAR(255) NOT NULL,
    receiverId VARCHAR(255) NOT NULL,
    lastMessage VARCHAR(255),
    lastUpdated DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (senderId) REFERENCES users (id),
    FOREIGN KEY (receiverId) REFERENCES users (id)
);