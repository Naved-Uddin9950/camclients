CREATE TABLE IF NOT EXISTS messages (
    id CHAR(36) PRIMARY KEY DEFAULT(UUID()),        -- Unique ID for each message
    senderId VARCHAR(255) NOT NULL,                -- ID of the user/model who sent the message
    receiverId VARCHAR(255) NOT NULL,              -- ID of the user/model who received the message
    content TEXT,                                  -- The message content (for text messages)
    media JSON,                                    -- JSON array to store multiple media files (URLs and types)
    isUnlocked BOOLEAN DEFAULT FALSE,              -- Whether the media has been unlocked
    isRead BOOLEAN DEFAULT FALSE,                  -- Whether the message has been read
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Account creation timestamp
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Last updated timestamp
    FOREIGN KEY (senderId) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (receiverId) REFERENCES users (id) ON DELETE CASCADE
);